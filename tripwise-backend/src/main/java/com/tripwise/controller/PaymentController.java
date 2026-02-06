package com.tripwise.controller;

import com.razorpay.Order;
import com.razorpay.RazorpayException;
import com.tripwise.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    // TODO: Autowire WalletService here to credit funds on success
    // @Autowired
    // private WalletService walletService;

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody Map<String, Object> data) {
        try {
            double amount = Double.parseDouble(data.get("amount").toString());
            Order order = paymentService.createOrder(amount);
            return ResponseEntity.ok(order.toString());
        } catch (RazorpayException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error creating order: " + e.getMessage());
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(@RequestBody Map<String, String> data) {
        String orderId = data.get("razorpay_order_id");
        String paymentId = data.get("razorpay_payment_id");
        String signature = data.get("razorpay_signature");
        // String profileId = data.get("profile_id"); // Ideally pass this to update
        // wallet

        boolean isValid = paymentService.verifySignature(orderId, paymentId, signature);

        if (isValid) {
            // TODO: Update user wallet balance here
            // walletService.addFunds(profileId, amount);

            Map<String, Object> response = new HashMap<>();
            response.put("status", "success");
            response.put("message", "Payment verified successfully");
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body("Invalid signature");
        }
    }
}
