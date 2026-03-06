package com.tripwise.controller;

import com.razorpay.Order;
import com.razorpay.RazorpayException;
import com.tripwise.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private com.tripwise.service.WalletService walletService;

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
        String profileId = data.get("profile_id");

        boolean isValid = paymentService.verifySignature(orderId, paymentId, signature);

        if (isValid) {
            try {
                if (profileId != null) {
                    // Securely fetch order details from Razorpay to get the actual amount
                    Order order = paymentService.getOrder(orderId);

                    // Razorpay returns amount in paise (Integer)
                    Number amountInPaise = order.get("amount");
                    BigDecimal amountInRupees = BigDecimal.valueOf(amountInPaise.longValue())
                            .divide(BigDecimal.valueOf(100));

                    // Credit funds to wallet
                    walletService.creditFunds(profileId, amountInRupees).subscribe();
                }

                Map<String, Object> response = new HashMap<>();
                response.put("status", "success");
                response.put("message", "Payment verified successfully");
                return ResponseEntity.ok(response);

            } catch (RazorpayException e) {
                return ResponseEntity.internalServerError().body("Failed to fetch order details: " + e.getMessage());
            } catch (Exception e) {
                return ResponseEntity.internalServerError().body("Payment processing failed: " + e.getMessage());
            }
        } else {
            return ResponseEntity.badRequest().body("Invalid signature");
        }
    }
}
