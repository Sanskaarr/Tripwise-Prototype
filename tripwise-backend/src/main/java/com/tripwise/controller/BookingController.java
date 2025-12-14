package com.tripwise.controller;

import com.tripwise.dto.BookingRequest;
import com.tripwise.dto.BookingResponse;
import com.tripwise.service.BookingService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {
    private static final Logger logger = LoggerFactory.getLogger(BookingController.class);
    
    private final BookingService bookingService;
    
    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }
    
    @PostMapping("/flights/search")
    public ResponseEntity<?> searchFlights(@RequestBody BookingRequest request) {
        try {
            logger.info("Received flight search request from {} to {}", 
                request.getOrigin(), request.getDestination());
            
            if (request.getOrigin() == null || request.getDestination() == null) {
                return ResponseEntity.badRequest().body(createErrorResponse("Origin and destination are required"));
            }
            
            if (request.getNumberOfPassengers() == null || request.getNumberOfPassengers() <= 0) {
                return ResponseEntity.badRequest().body(createErrorResponse("Valid number of passengers is required"));
            }
            
            BookingResponse response = bookingService.searchFlights(request);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error searching flights: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse("Error searching flights: " + e.getMessage()));
        }
    }
    
    @PostMapping("/hotels/search")
    public ResponseEntity<?> searchHotels(@RequestBody BookingRequest request) {
        try {
            logger.info("Received hotel search request for {}", request.getDestination());
            
            if (request.getDestination() == null) {
                return ResponseEntity.badRequest().body(createErrorResponse("Destination is required"));
            }
            
            if (request.getStartDate() == null || request.getEndDate() == null) {
                return ResponseEntity.badRequest().body(createErrorResponse("Start date and end date are required"));
            }
            
            BookingResponse response = bookingService.searchHotels(request);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error searching hotels: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse("Error searching hotels: " + e.getMessage()));
        }
    }
    
    @PostMapping("/activities/search")
    public ResponseEntity<?> searchActivities(@RequestBody BookingRequest request) {
        try {
            logger.info("Received activity search request for {}", request.getDestination());
            
            if (request.getDestination() == null) {
                return ResponseEntity.badRequest().body(createErrorResponse("Destination is required"));
            }
            
            BookingResponse response = bookingService.searchActivities(request);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error searching activities: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse("Error searching activities: " + e.getMessage()));
        }
    }
    
    @PostMapping("/{bookingId}/confirm")
    public ResponseEntity<?> confirmBooking(
            @PathVariable String bookingId,
            @RequestParam String optionId) {
        try {
            logger.info("Confirming booking {} with option {}", bookingId, optionId);
            
            BookingResponse response = bookingService.confirmBooking(bookingId, optionId);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error confirming booking: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse("Error confirming booking: " + e.getMessage()));
        }
    }
    
    private Map<String, Object> createErrorResponse(String message) {
        Map<String, Object> error = new HashMap<>();
        error.put("success", false);
        error.put("message", message);
        error.put("timestamp", System.currentTimeMillis());
        return error;
    }
}
