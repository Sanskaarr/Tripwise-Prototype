package com.tripwise.service;

import com.tripwise.ai.ChatGPTClient;
import com.tripwise.dto.TripRequest;
import com.tripwise.prompt.SystemPromptFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.Arrays;
import java.util.List;

@Service
public class LocalKnowledgeService {
    
    private static final Logger logger = LoggerFactory.getLogger(LocalKnowledgeService.class);
    
    private final ChatGPTClient chatGPTClient;
    
    // Predefined local knowledge filters to prevent blog repetition
    private static final List<String> BLOG_REPETITION_KEYWORDS = Arrays.asList(
        "hidden gem", "must-visit", "bucket list", "off the beaten path", 
        "instagrammable", "viral", "trending", "influencer"
    );
    
    @Autowired
    public LocalKnowledgeService(ChatGPTClient chatGPTClient) {
        this.chatGPTClient = chatGPTClient;
    }
    
    public Mono<String> extractLocalPlaces(String destination, String travelStyle) {
        logger.debug("Extracting local places for destination: {} with style: {}", destination, travelStyle);
        
        String prompt = SystemPromptFactory.createLocalKnowledgePrompt(destination, travelStyle);
        
        return chatGPTClient.generateResponse(
                "You are a local knowledge expert. Focus on places with genuine local relevance, not tourist traps.", 
                prompt)
                .map(this::filterBlogRepetition);
    }
    
    public Mono<String> enhanceWithLocalInsights(String baseResponse, String destination, TripRequest request) {
        logger.debug("Enhancing response with local insights for destination: {}", destination);
        
        String enhancementPrompt = String.format("""
            Enhance this travel response with authentic local insights that would not appear in typical travel blogs:
            
            Base Response:
            %s
            
            Destination: %s
            Travel Style: %s
            User Country: %s
            
            Add authentic local elements:
            1. Specific neighborhoods locals actually recommend
            2. Local food spots tourists miss
            3. Transportation methods locals actually use
            4. Cultural nuances only locals know
            5. Realistic warnings locals would give friends
            
            CRITICAL: 
            - Do NOT use blog-style phrases like "hidden gems" or "must-visit"
            - Focus on practical, lived experience
            - Maintain the conversational, local friend tone
            - Integrate naturally, don't append as lists
            """, baseResponse, destination, request.getTravelStyle(), request.getUserCountry());
        
        return chatGPTClient.generateResponse(
                "You are enhancing travel advice with authentic local knowledge. Write naturally as a local friend.", 
                enhancementPrompt);
    }
    
    public String filterBlogRepetition(String content) {
        String filtered = content;
        
        for (String keyword : BLOG_REPETITION_KEYWORDS) {
            filtered = filtered.replaceAll("(?i)" + keyword, "local favorite");
        }
        
        logger.debug("Applied blog repetition filters to content");
        return filtered;
    }
    
    public boolean validateLocalAuthenticity(String content) {
        // Check for blog-style indicators
        long blogIndicators = BLOG_REPETITION_KEYWORDS.stream()
                .mapToLong(keyword -> content.toLowerCase().contains(keyword.toLowerCase()) ? 1 : 0)
                .sum();
        
        // If too many blog indicators, flag as not authentic
        boolean isAuthentic = blogIndicators <= 2;
        
        if (!isAuthentic) {
            logger.warn("Content flagged for excessive blog-style indicators: {}", blogIndicators);
        }
        
        return isAuthentic;
    }
    
    public Mono<String> getLocalCulturalContext(String destination, String userCountry) {
        logger.debug("Getting cultural context for destination: {} from user country: {}", destination, userCountry);
        
        String culturalPrompt = String.format("""
            Provide cultural context for travelers from %s visiting %s:
            
            Focus on:
            1. Cultural differences that might cause confusion
            2. Local customs visitors should respect
            3. Common cultural mistakes tourists make
            4. Local etiquette that shows respect
            5. Communication styles and norms
            
            Be specific and practical. Avoid generic advice.
            """, userCountry, destination);
        
        return chatGPTClient.generateResponse(
                "You are a cultural context expert providing practical advice for cross-cultural travel.", 
                culturalPrompt);
    }
}
