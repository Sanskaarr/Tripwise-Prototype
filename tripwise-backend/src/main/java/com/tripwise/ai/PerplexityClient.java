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
public class PerplexityClient {

        private static final Logger logger = LoggerFactory.getLogger(PerplexityClient.class);
        private static final String MODEL = "sonar";

        private final WebClient webClient;
        private final ObjectMapper objectMapper;

        public PerplexityClient(WebClientConfig webClientConfig) {
                this.webClient = webClientConfig.perplexityWebClient();
                this.objectMapper = new ObjectMapper();
        }

        public Mono<String> validateFacts(String destination, String factValidationPrompt) {
                logger.debug("Calling Perplexity API for fact validation on destination: {}", destination);

                Map<String, Object> requestBody = Map.of(
                                "model", MODEL,
                                "messages", new Object[] {
                                                Map.of("role", "system", "content",
                                                                "You are a factual validation specialist for travel information. Provide accurate, current information about costs, transportation, payment methods, and local conditions."),
                                                Map.of("role", "user", "content", factValidationPrompt)
                                },
                                "max_tokens", 1000,
                                "temperature", 0.1);

                return webClient.post()
                                .bodyValue(requestBody)
                                .retrieve()
                                .bodyToMono(String.class)
                                .timeout(Duration.ofSeconds(20))
                                .doOnError(error -> logger.error("Error calling Perplexity API", error))
                                .map(this::extractContentFromResponse);
        }

        public Mono<String> getLocalSignals(String destination, String travelStyle) {
                logger.debug("Getting local signals for destination: {} with style: {}", destination, travelStyle);

                String prompt = String.format(
                                "Provide current local information about %s for %s travelers. Focus on: " +
                                                "1. Actual transportation costs and methods locals use " +
                                                "2. Current daily budget ranges for different spending levels " +
                                                "3. Payment methods (cash vs digital acceptance) " +
                                                "4. Local popularity of places and activities " +
                                                "5. Current safety conditions and realistic warnings " +
                                                "6. Common tourist mistakes to avoid " +
                                                "Be specific and factual, not promotional.",
                                destination, travelStyle);

                Map<String, Object> requestBody = Map.of(
                                "model", MODEL,
                                "messages", new Object[] {
                                                Map.of("role", "system", "content",
                                                                "You provide factual, current local information for travel planning. Focus on practical realities, not tourism marketing."),
                                                Map.of("role", "user", "content", prompt)
                                },
                                "max_tokens", 1500,
                                "temperature", 0.2);

                return webClient.post()
                                .bodyValue(requestBody)
                                .retrieve()
                                .bodyToMono(String.class)
                                .timeout(Duration.ofSeconds(20))
                                .doOnError(error -> logger.error("Error getting local signals from Perplexity", error))
                                .map(this::extractContentFromResponse);
        }

        private String extractContentFromResponse(String jsonResponse) {
                try {
                        JsonNode root = objectMapper.readTree(jsonResponse);
                        JsonNode contentNode = root.at("/choices/0/message/content");

                        if (contentNode.isMissingNode() || contentNode.isNull()) {
                                logger.error("Perplexity response missing content. Full response: {}", jsonResponse);
                                throw new IllegalStateException("Perplexity response missing content");
                        }

                        String content = contentNode.asText();
                        if (content == null || content.isBlank()) {
                                throw new IllegalStateException("Perplexity response content is empty");
                        }

                        return content;

                } catch (Exception e) {
                        logger.error("Error parsing Perplexity response: {}", e.getMessage());
                        throw new IllegalStateException("Failed to parse Perplexity response", e);
                }
        }
}
