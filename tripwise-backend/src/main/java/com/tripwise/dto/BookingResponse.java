package com.tripwise.dto;

import java.util.List;

public class BookingResponse {
    private String bookingId;
    private String bookingType;
    private String status;
    private Double totalPrice;
    private String currency;
    private List<BookingOption> options;
    private String message;

    public BookingResponse() {}

    public BookingResponse(String bookingId, String bookingType, String status, Double totalPrice,
                          String currency, List<BookingOption> options, String message) {
        this.bookingId = bookingId;
        this.bookingType = bookingType;
        this.status = status;
        this.totalPrice = totalPrice;
        this.currency = currency;
        this.options = options;
        this.message = message;
    }

    public String getBookingId() { return bookingId; }
    public void setBookingId(String bookingId) { this.bookingId = bookingId; }
    public String getBookingType() { return bookingType; }
    public void setBookingType(String bookingType) { this.bookingType = bookingType; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Double getTotalPrice() { return totalPrice; }
    public void setTotalPrice(Double totalPrice) { this.totalPrice = totalPrice; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    public List<BookingOption> getOptions() { return options; }
    public void setOptions(List<BookingOption> options) { this.options = options; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
