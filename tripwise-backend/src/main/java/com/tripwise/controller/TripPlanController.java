package com.tripwise.controller;

import com.tripwise.ai.GeminiClient;
import com.tripwise.config.AIPrompts;
import com.tripwise.dto.TripRequest;
import com.tripwise.dto.TripResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/tripwise")
@RequiredArgsConstructor
public class TripPlanController {

    private final GeminiClient geminiClient;

    @PostMapping("/plan")
    public ResponseEntity<TripResponse> planTrip(@Valid @RequestBody TripRequest tripRequest) {
        log.info("Trip plan request: destination={}, days={}, budget={}, style={}",
                tripRequest.getDestination(), tripRequest.getDays(),
                tripRequest.getBudgetLevel(), tripRequest.getTravelStyle());
        try {
            String userPrompt = String.format(
                    "Plan a trip to %s for %d days with a %s budget. My travel style is %s.",
                    tripRequest.getDestination(), tripRequest.getDays(),
                    tripRequest.getBudgetLevel(), tripRequest.getTravelStyle());

            String aiResponse = geminiClient.generateResponse(AIPrompts.LOCAL_GUIDE_SYSTEM_PROMPT, userPrompt)
                    .timeout(java.time.Duration.ofSeconds(60))
                    .block();

            if (aiResponse != null && !aiResponse.isEmpty()) {
                return ResponseEntity.ok(new TripResponse(aiResponse));
            }
            return ResponseEntity.badRequest().body(new TripResponse(null, false, "AI returned an empty response"));
        } catch (Exception e) {
            log.error("Trip planning failed for destination: {}", tripRequest.getDestination(), e);
            return ResponseEntity.internalServerError()
                    .body(new TripResponse(null, false, "Trip planning failed. Please try again."));
        }
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("TripWise API is running");
    }
}
