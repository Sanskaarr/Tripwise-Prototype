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

    private static final String GEMINI_STREAM_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:streamGenerateContent";

    public Flux<String> streamChatResponse(ChatRequest request) {
        String apiKey = apiConfig.getGeminiApiKey();
        if (apiKey.isEmpty()) {
            return Flux.just("Error: Gemini API key not configured. Please check your .env file.");
        }

        String systemPrompt = AIPrompts.getContextualPrompt(request.getDestination(), request.getProfileContext());
        List<Map<String, Object>> contents = constructContents(request.getMessages());

        String maskedKey = apiKey.length() > 8 
                ? apiKey.substring(0, 6) + "..." + apiKey.substring(apiKey.length() - 4) 
                : "invalid-short-key";
        logger.info("Chat stream → key={} | destination={} | messages={} | hasProfileContext={}",
                maskedKey,
                request.getDestination(),
                contents.size(),
                request.getProfileContext() != null && !request.getProfileContext().isEmpty());

        Map<String, Object> requestBody = Map.of(
                "systemInstruction", Map.of("parts", List.of(Map.of("text", systemPrompt))),
                "contents", contents,
                "generationConfig", Map.of(
                        "temperature", 0.7,
                        "topP", 0.95,
                        "topK", 40,
                        "maxOutputTokens", 8192,
                        "responseMimeType", "text/plain"));

        return webClient.post()
                .uri(GEMINI_STREAM_URL + "?alt=sse")
                .header("x-goog-api-key", apiKey)
                .bodyValue(requestBody)
                .retrieve()
                .onStatus(status -> status.isError(), response -> response.bodyToMono(String.class).flatMap(body -> {
                    logger.error("GEMINI STREAM ERROR: status={} | body={}", response.statusCode(), body);
                    return Mono.error(new RuntimeException("Gemini API error " + response.statusCode() + ": " + body));
                }))
                .bodyToFlux(
                        new org.springframework.core.ParameterizedTypeReference<org.springframework.http.codec.ServerSentEvent<String>>() {
                        })
                .map(event -> event.data() != null ? event.data() : "")
                .map(this::extractTextFromSseChunk)
                .filter(text -> !text.isEmpty())
                .doOnComplete(() -> logger.info("Chat stream completed"))
                .doOnError(error -> logger.error("GEMINI STREAM FAILED: {}", error.getMessage()));
    }

    public Mono<String> generateJsonResponse(String systemPrompt, String userPrompt) {
        String apiKey = apiConfig.getGeminiApiKey();
        if (apiKey.isEmpty()) {
            return Mono.just("{}");
        }

        String maskedKey = apiKey.length() > 8 
                ? apiKey.substring(0, 6) + "..." + apiKey.substring(apiKey.length() - 4) 
                : "invalid-short-key";
        logger.info("Gemini JSON request → key={} | userPrompt length={}", maskedKey, userPrompt.length());

        Map<String, Object> requestBody = Map.of(
                "systemInstruction", Map.of("parts", List.of(Map.of("text", systemPrompt))),
                "contents", List.of(Map.of("role", "user", "parts", List.of(Map.of("text", userPrompt)))),
                "generationConfig", Map.of(
                        "temperature", 0.7,
                        "maxOutputTokens", 65536,
                        "responseMimeType", "application/json"));

        return webClient.post()
                .uri("https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent")
                .header("x-goog-api-key", apiKey)
                .bodyValue(requestBody)
                .retrieve()
                .onStatus(status -> status.isError(), response -> response.bodyToMono(String.class).flatMap(body -> {
                    logger.error("GEMINI JSON ERROR: Status: {} | Message: {}", response.statusCode(), body);
                    return Mono
                            .error(new RuntimeException("Google API Error: " + response.statusCode() + " - " + body));
                }))
                .bodyToMono(com.fasterxml.jackson.databind.JsonNode.class)
                .map(node -> {
                    String finishReason = node.at("/candidates/0/finishReason").asText("");
                    if ("MAX_TOKENS".equals(finishReason)) {
                        logger.error(
                                "Gemini JSON response was truncated (MAX_TOKENS). Consider shortening the prompt or reducing itinerary size.");
                        throw new RuntimeException(
                                "Gemini output was truncated — plan too large for current token budget");
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

        String maskedKey = apiKey.length() > 8 
                ? apiKey.substring(0, 6) + "..." + apiKey.substring(apiKey.length() - 4) 
                : "invalid-short-key";
        logger.info("Gemini text request → key={} | userPrompt length={}", maskedKey, userPrompt.length());

        Map<String, Object> requestBody = Map.of(
                "systemInstruction", Map.of("parts", List.of(Map.of("text", systemPrompt))),
                "contents", List.of(Map.of("role", "user", "parts", List.of(Map.of("text", userPrompt)))),
                "generationConfig", Map.of(
                        "temperature", 0.7,
                        "maxOutputTokens", 8192,
                        "responseMimeType", "text/plain"));

        return webClient.post()
                .uri("https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent")
                .header("x-goog-api-key", apiKey)
                .bodyValue(requestBody)
                .retrieve()
                .onStatus(status -> status.isError(), response -> response.bodyToMono(String.class).flatMap(body -> {
                    logger.error("CRITICAL GEMINI ERROR: Status: {} | Message: {}", response.statusCode(), body);
                    return Mono
                            .error(new RuntimeException("Google API Error: " + response.statusCode() + " - " + body));
                }))
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

    private List<Map<String, Object>> constructContents(List<ChatRequest.Message> messages) {
        List<Map<String, Object>> contents = new ArrayList<>();
        if (messages == null || messages.isEmpty()) return contents;

        for (ChatRequest.Message msg : messages) {
            if (msg.getContent() == null || msg.getContent().isBlank()) continue;
            String role = "assistant".equals(msg.getRole()) ? "model" : "user";
            contents.add(Map.of(
                    "role", role,
                    "parts", List.of(Map.of("text", msg.getContent()))));
        }

        return contents;
    }

    private String extractTextFromSseChunk(String chunk) {
        try {
            if (chunk == null || chunk.isBlank())
                return "";
            if (chunk.equals("[DONE]"))
                return "";

            // Use Jackson for robust parsing
            com.fasterxml.jackson.databind.JsonNode node = objectMapper.readTree(chunk);
            return node.at("/candidates/0/content/parts/0/text").asText("");
        } catch (Exception e) {
            logger.error("Failed to parse Gemini SSE event data: {}", e.getMessage());
            return "";
        }
    }
}
