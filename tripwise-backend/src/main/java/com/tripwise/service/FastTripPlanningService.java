package com.tripwise.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tripwise.ai.ChatGPTClient;
import com.tripwise.dto.TripRequest;
import com.tripwise.dto.TripResponse;

import reactor.core.publisher.Mono;

/**
 * FAST Trip Planning Service - Optimized for speed
 * Single API call approach with fallback caching
 */
@Service
public class FastTripPlanningService {
    
    private static final Logger logger = LoggerFactory.getLogger(FastTripPlanningService.class);
    
    private final ChatGPTClient chatGPTClient;
    private final CacheService cacheService;
    
    @Autowired
    public FastTripPlanningService(ChatGPTClient chatGPTClient, CacheService cacheService) {
        this.chatGPTClient = chatGPTClient;
        this.cacheService = cacheService;
    }
    
    /**
     * Fast trip planning with single API call
     * Target: < 10 seconds response time
     */
    public Mono<TripResponse> planTripFast(TripRequest request) {
        logger.info("=== FAST TRIP PLANNING START ===");
        long startTime = System.currentTimeMillis();
        
        // Check cache first
        String cacheKey = String.format("fast_%s_%s_%s_%d", 
            request.getDestination().toLowerCase().replace(" ", "_"),
            request.getBudgetLevel().toLowerCase(),
            request.getTravelStyle().toLowerCase(),
            request.getDays()
        );
        
        String cachedResponse = cacheService.get(cacheKey);
        if (cachedResponse != null) {
            logger.info("✓ FAST CACHE HIT for {}", request.getDestination());
            return Mono.just(new TripResponse(cachedResponse, true, "Response from cache"));
        }
        
        // Single comprehensive prompt
        String comprehensivePrompt = String.format("""
            Create a detailed travel plan for %s with these requirements:
            
            TRIP DETAILS:
            - Destination: %s
            - Duration: %d days
            - Budget Level: %s
            - Travel Style: %s
            - Traveler from: %s
            
            REQUIREMENTS:
            - Write as natural narrative (no headings/bullets)
            - Minimum 800 words
            - Include: day-by-day flow, accommodation, food, transport, costs, culture, safety
            - Be specific with place names and realistic advice
            - Current year: 2026
            
            Provide practical, actionable advice that a traveler can use immediately.
            """,
            request.getDestination(),
            request.getDestination(),
            request.getDays(),
            request.getBudgetLevel(),
            request.getTravelStyle(),
            request.getUserCountry()
        );
        
        String systemPrompt = "You are an expert travel planner providing detailed, practical travel advice. Write naturally as a knowledgeable friend sharing specific recommendations.";
        
        return chatGPTClient.generateResponse(systemPrompt, comprehensivePrompt)
            .timeout(java.time.Duration.ofSeconds(60))
            .map(response -> {
                long totalTime = System.currentTimeMillis() - startTime;
                logger.info("✓ FAST PLANNING COMPLETE - {}ms", totalTime);
                
                // Cache the response
                cacheService.put(cacheKey, response);
                
                return new TripResponse(response, true, "AI planning complete");
            })
            .onErrorResume(error -> {
                logger.error("Fast planning failed", error);
                String fallback = String.format("""
                    Travel planning for %s is temporarily unavailable. 
                    Here are general recommendations for %d days:
                    
                    For %s budget in %s style:
                    - Stay in mid-range accommodations ($50-100/night)
                    - Try local restaurants and street food
                    - Use public transport or rental scooters
                    - Visit popular attractions during off-peak hours
                    - Keep emergency contacts handy
                    
                    Please try again for detailed personalized recommendations.
                    """,
                    request.getDestination(),
                    request.getDays(),
                    request.getBudgetLevel(),
                    request.getTravelStyle(),
                    request.getDestination()
                );
                
                return Mono.just(new TripResponse(fallback, false, "Service temporarily unavailable"));
            });
    }
}
