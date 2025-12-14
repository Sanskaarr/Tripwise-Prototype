package com.tripwise.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaymentResponse {
    private String paymentId;
    private String bookingId;
    private String status;
    private Double amount;
    private String currency;
    private String paymentMethod;
    private String qrCode;
    private String upiDeepLink;
    private String message;
}
