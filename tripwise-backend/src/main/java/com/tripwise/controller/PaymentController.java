package com.tripwise.controller;

import com.tripwise.dto.PaymentRequest;
import com.tripwise.dto.PaymentResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    @PostMapping("/process")
    public ResponseEntity<PaymentResponse> processPayment(@RequestBody PaymentRequest request) {
        // Mock payment logic
        boolean isSuccess = true; // Always succeed for mock
        String transactionId = UUID.randomUUID().toString();
        
        if (request.getAmount() <= 0) {
            return ResponseEntity.badRequest().body(new PaymentResponse(false, "Invalid amount", null));
        }

        return ResponseEntity.ok(new PaymentResponse(true, "Payment successful", transactionId));
    }
}
