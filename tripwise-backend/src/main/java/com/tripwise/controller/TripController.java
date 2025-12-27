package com.tripwise.controller;

import com.tripwise.dto.TripRequest;
import com.tripwise.dto.TripResponse;
import com.tripwise.service.GeminiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/trip")
public class TripController {

    private final GeminiService geminiService;

    public TripController(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    @PostMapping("/plan")
    public ResponseEntity<TripResponse> planTrip(@RequestBody TripRequest request) {
        try {
            String prompt = String.format(
                "Plan a trip to %s from %s to %s. Interests: %s. Budget: %s. Travelers: %d.",
                request.getDestination(), request.getStartDate(), request.getEndDate(),
                String.join(", ", request.getInterests()), request.getBudget(), request.getTravelers()
            );

            String aiSuggestions = geminiService.generateLocalGuide(request.getDestination(), "English"); 
            // Note: Using generateLocalGuide as a placeholder for general AI generation if a specific planTrip method doesn't exist.

            Map<String, Object> data = new HashMap<>();
            data.put("tripId", UUID.randomUUID().toString());
            data.put("destination", request.getDestination());
            data.put("aiSuggestions", aiSuggestions);
            data.put("status", "Planned");

            return ResponseEntity.ok(new TripResponse(true, "Trip planned successfully", data));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new TripResponse(false, e.getMessage(), null));
        }
    }
}
