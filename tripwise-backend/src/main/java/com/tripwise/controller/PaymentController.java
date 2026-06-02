package com.tripwise.controller;

import com.razorpay.Order;
import com.razorpay.RazorpayException;
import com.tripwise.service.PaymentService;
import com.tripwise.service.ProfileService;
import com.tripwise.service.WalletService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.math.BigDecimal;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;
    private final WalletService walletService;
    private final ProfileService profileService;

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody Map<String, Object> data) {
        try {
            double amount = Double.parseDouble(data.get("amount").toString());
            Order order = paymentService.createOrder(amount);
            Map<String, Object> response = new JSONObject(order.toString()).toMap();
            return ResponseEntity.ok(response);
        } catch (RazorpayException e) {
            log.error("Razorpay order creation failed", e);
            return ResponseEntity.badRequest().body(Map.of("error", "Could not create payment order"));
        } catch (Exception e) {
            log.error("Unexpected error creating order", e);
            return ResponseEntity.internalServerError().body(Map.of("error", "Payment service unavailable"));
        }
    }

    @PostMapping("/verify")
    public Mono<ResponseEntity<?>> verifyPayment(
            @AuthenticationPrincipal String identifier,
            @RequestBody Map<String, String> data) {

        return profileService.findByIdentifier(identifier)
                .switchIfEmpty(Mono.error(new IllegalStateException("User profile not found")))
                .<ResponseEntity<?>>flatMap(profile -> {
                    String profileId = profile.getProfileId();
                    String orderId = data.get("razorpay_order_id");
                    String paymentId = data.get("razorpay_payment_id");
                    String signature = data.get("razorpay_signature");

                    if (!paymentService.verifySignature(orderId, paymentId, signature)) {
                        return Mono.just(ResponseEntity.badRequest().body(Map.of("error", "Invalid payment signature")));
                    }

                    try {
                        Order order = paymentService.getOrder(orderId);
                        Number amountInPaise = order.get("amount");
                        BigDecimal amountInRupees = BigDecimal.valueOf(amountInPaise.longValue())
                                .divide(BigDecimal.valueOf(100));
                        return walletService.creditFunds(profileId, amountInRupees)
                                .thenReturn(ResponseEntity.ok(Map.of("status", "success", "message", "Payment verified successfully")));
                    } catch (RazorpayException e) {
                        log.error("Failed to fetch Razorpay order during verification", e);
                        return Mono.just(ResponseEntity.internalServerError().body(Map.of("error", "Payment processing failed")));
                    }
                })
                .onErrorResume(IllegalStateException.class, e ->
                        Mono.just(ResponseEntity.status(403).body(Map.of("error", e.getMessage()))))
                .onErrorResume(Exception.class, e -> {
                    log.error("Unexpected error during payment verification", e);
                    return Mono.just(ResponseEntity.internalServerError().body(Map.of("error", "Payment processing failed")));
                });
    }
}
