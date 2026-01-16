package com.tripwise.ai;

import java.time.Duration;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tripwise.config.WebClientConfig;

import reactor.core.publisher.Mono;

@Service
public class ChatGPTClient {
    
    private static final Logger logger = LoggerFactory.getLogger(ChatGPTClient.class);
    private static final String MODEL = "gpt-4o-mini";
    
    private final WebClient webClient;
    private final ObjectMapper objectMapper;
    
    public ChatGPTClient(WebClientConfig webClientConfig) {
        this.webClient = webClientConfig.openaiWebClient();
        this.objectMapper = new ObjectMapper();
    }
    
    public Mono<String> generateResponse(String systemPrompt, String userPrompt) {
        logger.debug("Calling ChatGPT API with prompt length: {}", userPrompt.length());
        
        Map<String, Object> requestBody = Map.of(
            "model", MODEL,
            "messages", new Object[]{
                Map.of("role", "system", "content", systemPrompt),
                Map.of("role", "user", "content", userPrompt)
            },
            "max_tokens", 2000,
            "temperature", 0.7
        );
        
        return webClient.post()
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .timeout(Duration.ofSeconds(60))
                .doOnError(error -> logger.error("Error calling ChatGPT API", error))
                .map(this::extractContentFromResponse);
    }
    
    private String extractContentFromResponse(String jsonResponse) {
        try {
            // Safe JSON extraction using Jackson
            JsonNode root = objectMapper.readTree(jsonResponse);
            JsonNode contentNode = root.at("/choices/0/message/content");
            
            if (contentNode.isMissingNode() || contentNode.isNull()) {
                throw new IllegalStateException("ChatGPT response missing content");
            }
            
            String content = contentNode.asText();
            
            if (content == null || content.isBlank()) {
                throw new IllegalStateException("ChatGPT response empty");
            }
            
            logger.debug("Successfully extracted content from ChatGPT response (length: {})", content.length());
            return content;
            
        } catch (IllegalStateException e) {
            logger.error("Error parsing ChatGPT response: {}", e.getMessage());
            throw new IllegalStateException("Failed to extract ChatGPT response content", e);
        } catch (Exception e) {
            logger.error("Unexpected error processing ChatGPT response: {}", e.getMessage());
            throw new IllegalStateException("Failed to process ChatGPT response", e);
        }
    }
    
    public Mono<String> generateDraftPlan(String prompt) {
        String systemPrompt = "You are TripWise, an AI travel planning assistant. Create a detailed trip structure based on the user's request. Focus on logical flow and comprehensive coverage.";
        return generateResponse(systemPrompt, prompt);
    }
    
    public Mono<String> generateFinalResponse(String prompt) {
        String systemPrompt = "You are TripWise, providing final travel advice. Write naturally as a local friend, with no headings or lists.";
        return generateResponse(systemPrompt, prompt);
    }
}
