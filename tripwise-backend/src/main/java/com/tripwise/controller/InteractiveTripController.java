package com.tripwise.controller;

import com.tripwise.model.TripPlanSession;
import com.tripwise.service.InteractivePlanningService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/tripwise/interactive")
@RequiredArgsConstructor
public class InteractiveTripController {

    private final InteractivePlanningService interactivePlanningService;

    // STEP 1: Init Session & Get Overview
    @PostMapping("/init/{profileId}")
    public Mono<ResponseEntity<TripPlanSession>> initSession(@PathVariable String profileId) {
        return interactivePlanningService.initSession(profileId)
                .map(ResponseEntity::ok);
    }

    // STEP 2A: Get Hotel Suggestions
    @GetMapping("/{sessionId}/hotels")
    public Mono<ResponseEntity<String>> getHotelSuggestions(@PathVariable String sessionId) {
        return interactivePlanningService.generateHotelOptions(sessionId)
                .map(json -> ResponseEntity.ok()
                        .contentType(org.springframework.http.MediaType.APPLICATION_JSON)
                        .body(json));
    }

    // STEP 2B: Select Hotel
    @PostMapping("/{sessionId}/hotels")
    public Mono<ResponseEntity<TripPlanSession>> selectHotel(
            @PathVariable String sessionId,
            @RequestBody TripPlanSession.HotelOption selectedHotel) {
        return interactivePlanningService.selectHotel(sessionId, selectedHotel)
                .map(ResponseEntity::ok);
    }

    // STEP 3A: Get Transport Suggestions
    @GetMapping("/{sessionId}/transport")
    public Mono<ResponseEntity<String>> getTransportSuggestions(@PathVariable String sessionId) {
        return interactivePlanningService.generateTransportOptions(sessionId)
                .map(json -> ResponseEntity.ok()
                        .contentType(org.springframework.http.MediaType.APPLICATION_JSON)
                        .body(json));
    }

    // STEP 3B: Select Transport
    @PostMapping("/{sessionId}/transport")
    public Mono<ResponseEntity<TripPlanSession>> selectTransport(
            @PathVariable String sessionId,
            @RequestBody TripPlanSession.TransportOption selectedTransport) {
        return interactivePlanningService.selectTransport(sessionId, selectedTransport)
                .map(ResponseEntity::ok);
    }

    // STEP 4: Finalize & Generate Master Plan
    @PostMapping("/{sessionId}/finalize")
    public Mono<ResponseEntity<String>> finalizeTrip(@PathVariable String sessionId) {
        return interactivePlanningService.generateMasterPlan(sessionId)
                .map(ResponseEntity::ok);
    }
}
