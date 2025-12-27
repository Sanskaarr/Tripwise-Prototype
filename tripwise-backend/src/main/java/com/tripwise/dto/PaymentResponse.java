package com.tripwise.dto;

public class PaymentResponse {
    private boolean success;
    private String message;

    public PaymentResponse() {}

    public PaymentResponse(String paymentId, String bookingId, String status, Double amount,
                          String currency, String paymentMethod, String qrCode, 
                          String upiDeepLink, String message) {
        this.paymentId = paymentId;
        this.bookingId = bookingId;
        this.status = status;
        this.amount = amount;
        this.currency = currency;
        this.paymentMethod = paymentMethod;
        this.qrCode = qrCode;
        this.upiDeepLink = upiDeepLink;
        this.message = message;
    }

    public String getPaymentId() { return paymentId; }
    public void setPaymentId(String paymentId) { this.paymentId = paymentId; }
    public String getBookingId() { return bookingId; }
    public void setBookingId(String bookingId) { this.bookingId = bookingId; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
    public String getQrCode() { return qrCode; }
    public void setQrCode(String qrCode) { this.qrCode = qrCode; }
    public String getUpiDeepLink() { return upiDeepLink; }
    public void setUpiDeepLink(String upiDeepLink) { this.upiDeepLink = upiDeepLink; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}