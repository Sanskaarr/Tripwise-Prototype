package com.tripwise.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tripwise.dto.TripRequest;
import com.tripwise.dto.TripResponse;
import com.tripwise.service.FastTripPlanningService;
import com.tripwise.service.OptimizedAIOrchestratorService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/tripwise")
public class TripPlanController {

    private static final Logger logger = LoggerFactory.getLogger(TripPlanController.class);

    private final OptimizedAIOrchestratorService optimizedAIOrchestratorService;
    private final FastTripPlanningService fastTripPlanningService;

    @Autowired
    public TripPlanController(OptimizedAIOrchestratorService optimizedAIOrchestratorService,
            FastTripPlanningService fastTripPlanningService) {
        this.optimizedAIOrchestratorService = optimizedAIOrchestratorService;
        this.fastTripPlanningService = fastTripPlanningService;
    }

    // Test endpoint removed as requested to rely on real AI services

    @PostMapping("/plan-fast")
    public ResponseEntity<TripResponse> planTripFast(@Valid @RequestBody TripRequest tripRequest) {
        logger.info("Received FAST trip planning request for destination: {}", tripRequest.getDestination());

        try {
            TripResponse response = fastTripPlanningService.planTripFast(tripRequest)
                    .timeout(java.time.Duration.ofSeconds(70))
                    .block();

            if (response != null && response.isValid()) {
                logger.info("Successfully generated FAST trip plan for destination: {}", tripRequest.getDestination());
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest().body(response);
            }

        } catch (Exception e) {
            logger.error("Error in FAST trip planning for destination: {}", tripRequest.getDestination(), e);
            return ResponseEntity.internalServerError()
                    .body(new TripResponse(null, false, "Error: " + e.getMessage()));
        }
    }

    @PostMapping("/plan")
    public ResponseEntity<TripResponse> planTrip(@Valid @RequestBody TripRequest tripRequest) {
        logger.info("Received trip planning request for destination: {}, days: {}, budget: {}, style: {}",
                tripRequest.getDestination(),
                tripRequest.getDays(),
                tripRequest.getBudgetLevel(),
                tripRequest.getTravelStyle());

        try {
            // CALL DRIVER DIRECTLY (No more middleman)
            TripResponse response = optimizedAIOrchestratorService.orchestrateTripPlanning(tripRequest)
                    .timeout(java.time.Duration.ofSeconds(300)) // Overall timeout increased for complex orchestration
                    .block(); // Block for now, could be async in production

            if (response.isValid()) {
                logger.info("Successfully generated trip plan for destination: {}", tripRequest.getDestination());
                return ResponseEntity.ok(response);
            } else {
                logger.warn("Generated trip plan failed validation for destination: {}. Reason: {}",
                        tripRequest.getDestination(), response.getValidationMessage());
                return ResponseEntity.badRequest().body(response);
            }

        } catch (Exception e) {
            logger.error("Error processing trip planning request for destination: {}",
                    tripRequest.getDestination(), e);
            return ResponseEntity.internalServerError()
                    .body(new TripResponse(null, false, "Internal server error: " + e.getMessage()));
        }
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("TripWise API is running");
    }
}
