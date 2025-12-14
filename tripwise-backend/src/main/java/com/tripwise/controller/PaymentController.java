package com.tripwise.controller;

import com.tripwise.dto.PaymentRequest;
import com.tripwise.dto.PaymentResponse;
import com.tripwise.service.PaymentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {
    private static final Logger logger = LoggerFactory.getLogger(PaymentController.class);
    
    private final PaymentService paymentService;
    
    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }
    
    @PostMapping("/upi/initiate")
    public ResponseEntity<?> initiateUpiPayment(@RequestBody PaymentRequest request) {
        try {
            logger.info("Initiating UPI payment for booking {}", request.getBookingId());
            
            if (request.getBookingId() == null || request.getAmount() == null) {
                return ResponseEntity.badRequest().body(createErrorResponse("Booking ID and amount are required"));
            }
            
            if (request.getAmount() <= 0) {
                return ResponseEntity.badRequest().body(createErrorResponse("Amount must be greater than 0"));
            }
            
            PaymentResponse response = paymentService.initiateUpiPayment(request);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error initiating UPI payment: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse("Error initiating UPI payment: " + e.getMessage()));
        }
    }
    
    @PostMapping("/qr/initiate")
    public ResponseEntity<?> initiateQRPayment(@RequestBody PaymentRequest request) {
        try {
            logger.info("Initiating QR payment for booking {}", request.getBookingId());
            
            if (request.getBookingId() == null || request.getAmount() == null) {
                return ResponseEntity.badRequest().body(createErrorResponse("Booking ID and amount are required"));
            }
            
            if (request.getAmount() <= 0) {
                return ResponseEntity.badRequest().body(createErrorResponse("Amount must be greater than 0"));
            }
            
            PaymentResponse response = paymentService.initiateQRPayment(request);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error initiating QR payment: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse("Error initiating QR payment: " + e.getMessage()));
        }
    }
    
    @GetMapping("/{paymentId}/verify")
    public ResponseEntity<?> verifyPayment(@PathVariable String paymentId) {
        try {
            logger.info("Verifying payment {}", paymentId);
            
            PaymentResponse response = paymentService.verifyPayment(paymentId);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error verifying payment: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse("Error verifying payment: " + e.getMessage()));
        }
    }
    
    @GetMapping("/{paymentId}/status")
    public ResponseEntity<?> getPaymentStatus(@PathVariable String paymentId) {
        try {
            logger.info("Getting status for payment {}", paymentId);
            
            PaymentResponse response = paymentService.getPaymentStatus(paymentId);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error getting payment status: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse("Error getting payment status: " + e.getMessage()));
        }
    }
    
    @PostMapping("/{paymentId}/simulate-success")
    public ResponseEntity<?> simulateSuccess(@PathVariable String paymentId) {
        try {
            logger.info("Simulating success for payment {}", paymentId);
            
            PaymentResponse response = paymentService.simulatePaymentSuccess(paymentId);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error simulating payment success: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse("Error simulating payment: " + e.getMessage()));
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
