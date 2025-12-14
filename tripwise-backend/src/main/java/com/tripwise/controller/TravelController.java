package com.tripwise.controller;

import com.tripwise.service.TravelIntentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/travel")
public class TravelController {

    private final TravelIntentService travelIntentService;

    public TravelController(TravelIntentService travelIntentService) {
        this.travelIntentService = travelIntentService;
    }

    @PostMapping("/intent")
    public ResponseEntity<Map<String, Object>> processTravelIntent(@RequestBody Map<String, String> request) {
        try {
            String userId = request.get("userId");
            String message = request.get("message");
            String provider = request.getOrDefault("provider", "gemini");

            String response = travelIntentService.processTravelIntent(userId, message, provider);

            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("response", response);
            result.put("provider", provider);

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/plan")
    public ResponseEntity<Map<String, Object>> generateTravelPlan(@RequestBody Map<String, String> request) {
        try {
            String userId = request.get("userId");
            String destination = request.get("destination");
            String duration = request.get("duration");
            String budget = request.get("budget");
            String preferences = request.getOrDefault("preferences", "");

            String response = travelIntentService.generateTravelPlan(userId, destination, duration, budget, preferences);

            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("plan", response);

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/recommendations")
    public ResponseEntity<Map<String, Object>> getLocalRecommendations(@RequestBody Map<String, String> request) {
        try {
            String userId = request.get("userId");
            String location = request.get("location");
            String category = request.get("category");

            String response = travelIntentService.getLocalRecommendations(userId, location, category);

            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("recommendations", response);

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/weather")
    public ResponseEntity<Map<String, Object>> getWeatherAndTips(@RequestBody Map<String, String> request) {
        try {
            String userId = request.get("userId");
            String destination = request.get("destination");
            String travelDate = request.get("travelDate");

            String response = travelIntentService.getWeatherAndTravelTips(userId, destination, travelDate);

            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("weatherInfo", response);

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/optimize")
    public ResponseEntity<Map<String, Object>> optimizeItinerary(@RequestBody Map<String, String> request) {
        try {
            String userId = request.get("userId");
            String currentItinerary = request.get("itinerary");
            String constraints = request.getOrDefault("constraints", "");

            String response = travelIntentService.optimizeItinerary(userId, currentItinerary, constraints);

            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("optimizedItinerary", response);

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}
