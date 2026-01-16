package com.tripwise.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tripwise.dto.TripRequest;
import com.tripwise.dto.TripResponse;

@Service
public class TripPlanningService {

    private static final Logger logger = LoggerFactory.getLogger(TripPlanningService.class);

    private final OptimizedAIOrchestratorService optimizedAIOrchestratorService;

    @Autowired
    public TripPlanningService(OptimizedAIOrchestratorService optimizedAIOrchestratorService) {
        this.optimizedAIOrchestratorService = optimizedAIOrchestratorService;
    }

    public TripResponse planTrip(TripRequest request) {
        logger.info("Starting trip planning for destination: {} ({} days)",
                request.getDestination(), request.getDays());

        try {
            // Execute optimized AI orchestration flow with timeout
            return optimizedAIOrchestratorService.orchestrateTripPlanning(request)
                    .timeout(java.time.Duration.ofSeconds(90)) // Overall timeout
                    .block(); // Block for now, could be async in production

        } catch (Exception e) {
            logger.error("Error in trip planning for destination: {}", request.getDestination(), e);
            return new TripResponse(null, false, "Internal error during trip planning: " + e.getMessage());
        }
    }
}
