package com.tripwise.service;

import com.tripwise.dto.PaymentRequest;
import com.tripwise.dto.PaymentResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Random;

@Service
public class PaymentService {
    private static final Logger logger = LoggerFactory.getLogger(PaymentService.class);
    private final Random random = new Random();
    
    private static final String MERCHANT_UPI = "tripwise@paytm";
    private static final String MERCHANT_NAME = "TripWise";
    
    public PaymentResponse initiateUpiPayment(PaymentRequest request) {
        logger.info("Initiating UPI payment for booking {} with amount {}", 
            request.getBookingId(), request.getAmount());
        
        String paymentId = generatePaymentId();
        String transactionRef = "TXN" + System.currentTimeMillis();
        
        String upiDeepLink = String.format(
            "upi://pay?pa=%s&pn=%s&tr=%s&am=%.2f&cu=INR&tn=Payment for %s",
            MERCHANT_UPI, MERCHANT_NAME, transactionRef, request.getAmount(), request.getBookingId()
        );
        
        String qrCodeData = generateMockQRCode(request.getAmount(), request.getBookingId());
        
        return new PaymentResponse(
            paymentId,
            request.getBookingId(),
            "PENDING",
            request.getAmount(),
            "INR",
            "UPI",
            qrCodeData,
            upiDeepLink,
            "UPI payment initiated. Scan QR code or use deep link to complete payment. Mock payment - no real transaction."
        );
    }
    
    public PaymentResponse initiateQRPayment(PaymentRequest request) {
        logger.info("Initiating QR payment for booking {} with amount {}", 
            request.getBookingId(), request.getAmount());
        
        String paymentId = generatePaymentId();
        String qrCodeData = generateMockQRCode(request.getAmount(), request.getBookingId());
        
        return new PaymentResponse(
            paymentId,
            request.getBookingId(),
            "PENDING",
            request.getAmount(),
            "INR",
            "QR",
            qrCodeData,
            null,
            "QR code generated. Scan to complete payment. Mock payment - no real transaction."
        );
    }
    
    public PaymentResponse verifyPayment(String paymentId) {
        logger.info("Verifying payment {}", paymentId);
        
        boolean success = random.nextBoolean();
        
        if (success) {
            return new PaymentResponse(
                paymentId,
                "BK" + System.currentTimeMillis(),
                "SUCCESS",
                0.0,
                "INR",
                "UPI",
                null,
                null,
                "Payment completed successfully. Mock verification."
            );
        } else {
            return new PaymentResponse(
                paymentId,
                "BK" + System.currentTimeMillis(),
                "FAILED",
                0.0,
                "INR",
                "UPI",
                null,
                null,
                "Payment failed. Please try again. Mock verification."
            );
        }
    }
    
    public PaymentResponse simulatePaymentSuccess(String paymentId) {
        logger.info("Simulating payment success for {}", paymentId);
        
        return new PaymentResponse(
            paymentId,
            "MOCK_BOOKING_ID",
            "SUCCESS",
            0.0,
            "INR",
            "UPI",
            null,
            null,
            "Payment marked as successful. This is a mock simulation."
        );
    }
    
    public PaymentResponse getPaymentStatus(String paymentId) {
        logger.info("Getting payment status for {}", paymentId);
        
        String[] statuses = {"PENDING", "SUCCESS", "FAILED", "PROCESSING"};
        String status = statuses[random.nextInt(statuses.length)];
        
        return new PaymentResponse(
            paymentId,
            "BK" + System.currentTimeMillis(),
            status,
            0.0,
            "INR",
            "UPI",
            null,
            null,
            "Payment status: " + status + ". Mock status check."
        );
    }
    
    private String generatePaymentId() {
        return "PAY" + System.currentTimeMillis() + random.nextInt(10000);
    }
    
    private String generateMockQRCode(Double amount, String bookingId) {
        String qrData = String.format(
            "upi://pay?pa=%s&pn=%s&am=%.2f&cu=INR&tn=Payment for %s",
            MERCHANT_UPI, MERCHANT_NAME, amount, bookingId
        );
        
        return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
    }
}
