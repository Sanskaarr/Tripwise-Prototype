package com.tripwise.controller;

import com.tripwise.dto.TripIntentRequest;
import com.tripwise.dto.TripIntentResponse;
import com.tripwise.service.TripService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/trip")
@CrossOrigin(origins = "*")
public class TripController {

    @Autowired
    private TripService tripService;

    @PostMapping("/ai-intent")
    public ResponseEntity<?> processTravelIntent(@RequestBody TripIntentRequest request) {
        try {
            if (request.getUserId() == null || request.getUserId().isBlank()) {
                return ResponseEntity.badRequest().body(new ErrorResponse("User ID is required"));
            }
            if (request.getUserInput() == null || request.getUserInput().isBlank()) {
                return ResponseEntity.badRequest().body(new ErrorResponse("User input is required"));
            }

            TripIntentResponse response = tripService.processTravelIntent(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(new ErrorResponse("Failed to process travel intent: " + e.getMessage()));
        }
    }

    private static class ErrorResponse {
        private String message;

        public ErrorResponse(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }
}
