package com.tripwise.service;

import com.tripwise.dto.ChatMessage;
import com.tripwise.dto.PlaceDetails;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class TravelIntentService {

    private final OpenAIChatService openAIChatService;
    private final GeminiChatService geminiChatService;
    private final UserPreferencesService userPreferencesService;
    private final GoogleMapsService googleMapsService;

    @Value("${ai.provider:gemini}")
    private String defaultProvider;

    public TravelIntentService(OpenAIChatService openAIChatService, 
                               GeminiChatService geminiChatService,
                               UserPreferencesService userPreferencesService,
                               GoogleMapsService googleMapsService) {
        this.openAIChatService = openAIChatService;
        this.geminiChatService = geminiChatService;
        this.userPreferencesService = userPreferencesService;
        this.googleMapsService = googleMapsService;
    }

    public String processTravelIntent(String userId, String userMessage) {
        return processTravelIntent(userId, userMessage, defaultProvider);
    }

    public String processTravelIntent(String userId, String userMessage, String provider) {
        var preferences = userPreferencesService.getSessionContext(userId);
        String systemPrompt = buildSystemPrompt(preferences);

        userPreferencesService.addToConversationHistory(userId, "user", userMessage);

        String response;
        if ("openai".equalsIgnoreCase(provider)) {
            response = openAIChatService.chatWithContext(userMessage, systemPrompt);
        } else {
            response = geminiChatService.chatWithContext(userMessage, systemPrompt);
        }

        userPreferencesService.addToConversationHistory(userId, "assistant", response);

        return response;
    }

    public String generateTravelPlan(String userId, String destination, 
                                     String duration, String budget, String preferences) {
        String prompt = String.format(
            "Create a detailed travel plan for %s for %s with a budget of %s. " +
            "Consider these preferences: %s. " +
            "Include: daily itinerary, must-visit places, local cuisine, accommodation suggestions, " +
            "transportation tips, and estimated costs.",
            destination, duration, budget, preferences
        );

        return processTravelIntent(userId, prompt);
    }

    public String getLocalRecommendations(String userId, String location, String category) {
        List<PlaceDetails> places = googleMapsService.searchPlaces(category, location);
        
        StringBuilder placesInfo = new StringBuilder();
        if (!places.isEmpty()) {
            placesInfo.append("\n\nReal-time data from Google Maps:\n");
            for (PlaceDetails place : places) {
                placesInfo.append(String.format("- %s at %s (Rating: %.1f)\n", 
                    place.getName(), place.getAddress(), place.getRating()));
            }
        }
        
        String prompt = String.format(
            "Recommend the best %s in %s. Include: names, locations, price ranges, " +
            "opening hours, and why they're worth visiting. Consider local favorites and hidden gems.%s",
            category, location, placesInfo.toString()
        );

        return processTravelIntent(userId, prompt);
    }

    public String getWeatherAndTravelTips(String userId, String destination, String travelDate) {
        String prompt = String.format(
            "Provide weather information and travel tips for %s around %s. " +
            "Include: typical weather conditions, what to pack, best activities for the season, " +
            "and any travel advisories or cultural considerations.",
            destination, travelDate
        );

        return processTravelIntent(userId, prompt);
    }

    public String optimizeItinerary(String userId, String currentItinerary, String constraints) {
        String prompt = String.format(
            "Optimize this travel itinerary: %s. Constraints: %s. " +
            "Provide an improved version that maximizes experiences while respecting time and budget.",
            currentItinerary, constraints
        );

        return processTravelIntent(userId, prompt);
    }

    private String buildSystemPrompt(java.util.Map<String, Object> sessionContext) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("You are TripWise, an expert AI travel companion. ");
        prompt.append("You provide personalized travel recommendations, itineraries, and local insights. ");
        
        if (sessionContext.containsKey("preferences")) {
            @SuppressWarnings("unchecked")
            java.util.Map<String, Object> prefs = (java.util.Map<String, Object>) sessionContext.get("preferences");
            
            if (prefs.containsKey("preferredLanguage")) {
                prompt.append(String.format("Respond in %s. ", prefs.get("preferredLanguage")));
            }
            if (prefs.containsKey("budgetRange")) {
                prompt.append(String.format("User's budget range is %s. ", prefs.get("budgetRange")));
            }
            if (prefs.containsKey("travelStyle")) {
                prompt.append(String.format("User prefers %s travel style. ", prefs.get("travelStyle")));
            }
            if (prefs.containsKey("dietaryPreferences")) {
                prompt.append(String.format("User has %s dietary preferences. ", prefs.get("dietaryPreferences")));
            }
            if (prefs.containsKey("interests")) {
                prompt.append(String.format("User is interested in: %s. ", prefs.get("interests")));
            }
        }
        
        prompt.append("Be helpful, enthusiastic, and provide practical, actionable advice. ");
        prompt.append("Include specific recommendations with names, locations, and estimated costs when relevant.");
        
        return prompt.toString();
    }
}