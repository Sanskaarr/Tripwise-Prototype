package com.tripwise.ai;

import com.tripwise.config.AIPrompts;
import com.tripwise.config.ApiConfig;
import com.tripwise.dto.ChatRequest;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class GeminiClient {

    private static final Logger logger = LoggerFactory.getLogger(GeminiClient.class);
    private final WebClient webClient;
    private final ApiConfig apiConfig;
    private final com.fasterxml.jackson.databind.ObjectMapper objectMapper = new com.fasterxml.jackson.databind.ObjectMapper();

    private static final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash:streamGenerateContent";

    public Flux<String> streamChatResponse(ChatRequest request) {
        String apiKey = apiConfig.getGeminiApiKey();
        if (apiKey.isEmpty()) {
            return Flux.just("Error: Gemini API key not configured. Please check your .env file.");
        }

        String contextualPrompt = AIPrompts.getContextualPrompt(request.getDestination());

        // Construct Gemini direct API request body
        Map<String, Object> requestBody = Map.of(
            "contents", constructContents(contextualPrompt, request.getMessages()),
            "generationConfig", Map.of(
                "temperature", 0.7,
                "topP", 0.95,
                "topK", 40,
                "maxOutputTokens", 8192,
                "responseMimeType", "text/plain"
            )
        );

        return webClient.post()
                .uri(GEMINI_API_URL + "?alt=sse")
                .header("x-goog-api-key", apiKey)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToFlux(String.class)
                .map(this::extractTextFromSseChunk)
                .filter(text -> !text.isEmpty())
                .doOnError(error -> logger.error("GEMINI STREAM ERROR: Check if your API key is valid and has billing enabled. Details: {}", error.getMessage()));
    }

    public Mono<String> generateJsonResponse(String systemPrompt, String userPrompt) {
        String apiKey = apiConfig.getGeminiApiKey();
        if (apiKey.isEmpty()) {
            return Mono.just("{}");
        }

        Map<String, Object> requestBody = Map.of(
            "contents", List.of(
                Map.of("role", "user", "parts", List.of(Map.of("text", "System Instruction: " + systemPrompt + "\n\n" + userPrompt)))
            ),
            "generationConfig", Map.of(
                "temperature", 0.7,
                "maxOutputTokens", 65536,
                "responseMimeType", "application/json"
            )
        );

        return webClient.post()
                .uri("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent")
                .header("x-goog-api-key", apiKey)
                .bodyValue(requestBody)
                .retrieve()
                .onStatus(status -> status.isError(), response ->
                    response.bodyToMono(String.class).flatMap(body -> {
                        logger.error("GEMINI JSON ERROR: Status: {} | Message: {}", response.statusCode(), body);
                        return Mono.error(new RuntimeException("Google API Error: " + response.statusCode() + " - " + body));
                    })
                )
                .bodyToMono(com.fasterxml.jackson.databind.JsonNode.class)
                .map(node -> {
                    String finishReason = node.at("/candidates/0/finishReason").asText("");
                    if ("MAX_TOKENS".equals(finishReason)) {
                        logger.error("Gemini JSON response was truncated (MAX_TOKENS). Consider shortening the prompt or reducing itinerary size.");
                        throw new RuntimeException("Gemini output was truncated — plan too large for current token budget");
                    }
                    String text = node.at("/candidates/0/content/parts/0/text").asText("");
                    if (text.isEmpty()) {
                        logger.warn("Gemini JSON response was empty. Full response: {}", node);
                    }
                    return text;
                })
                .doOnError(error -> logger.error("Gemini JSON Request Failed: {}", error.getMessage()));
    }

    public Mono<String> generateResponse(String systemPrompt, String userPrompt) {
        String apiKey = apiConfig.getGeminiApiKey();
        if (apiKey.isEmpty()) {
            return Mono.just("Error: Gemini API key not configured.");
        }

        Map<String, Object> requestBody = Map.of(
            "contents", List.of(
                Map.of("role", "user", "parts", List.of(Map.of("text", "System Instruction: " + systemPrompt + "\n\n" + userPrompt)))
            ),
            "generationConfig", Map.of(
                "temperature", 0.7,
                "maxOutputTokens", 4096,
                "responseMimeType", "text/plain"
            )
        );

        return webClient.post()
                .uri("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent")
                .header("x-goog-api-key", apiKey)
                .bodyValue(requestBody)
                .retrieve()
                .onStatus(status -> status.isError(), response ->
                    response.bodyToMono(String.class).flatMap(body -> {
                        logger.error("CRITICAL GEMINI ERROR: Status: {} | Message: {}", response.statusCode(), body);
                        return Mono.error(new RuntimeException("Google API Error: " + response.statusCode() + " - " + body));
                    })
                )
                .bodyToMono(com.fasterxml.jackson.databind.JsonNode.class)
                .map(node -> {
                    String text = node.at("/candidates/0/content/parts/0/text").asText("");
                    if (text.isEmpty()) {
                        logger.warn("Gemini returned a valid JSON but empty text. Full response: {}", node.toString());
                    }
                    return text;
                })
                .doOnError(error -> logger.error("Gemini Request Failed: {}", error.getMessage()));
    }

    private List<Map<String, Object>> constructContents(String systemPrompt, List<ChatRequest.Message> messages) {
        List<Map<String, Object>> contents = new ArrayList<>();

        for (ChatRequest.Message msg : messages) {
            String role = msg.getRole().equals("assistant") ? "model" : "user";
            contents.add(Map.of(
                "role", role,
                "parts", List.of(Map.of("text", msg.getContent()))
            ));
        }

        // Add system prompt at the beginning if not present
        contents.add(0, Map.of(
            "role", "user",
            "parts", List.of(Map.of("text", "System Instruction: " + systemPrompt + "\n\nPlease acknowledge and proceed."))
        ));
        contents.add(1, Map.of(
            "role", "model",
            "parts", List.of(Map.of("text", "Understood. I am your local travel guide. How can I help you today?"))
        ));

        return contents;
    }

    private String extractTextFromSseChunk(String chunk) {
        try {
            if (chunk == null || chunk.isBlank()) return "";
            
            // Handle data: prefix
            String jsonPart = chunk;
            if (chunk.startsWith("data: ")) {
                jsonPart = chunk.substring(6).trim();
            }
            
            if (jsonPart.equals("[DONE]")) return "";

            // Use Jackson for robust parsing
            com.fasterxml.jackson.databind.JsonNode node = objectMapper.readTree(jsonPart);
            return node.at("/candidates/0/content/parts/0/text").asText("");
        } catch (Exception e) {
            // If parsing fails, it might not be a full JSON chunk yet
            return "";
        }
    }
}
