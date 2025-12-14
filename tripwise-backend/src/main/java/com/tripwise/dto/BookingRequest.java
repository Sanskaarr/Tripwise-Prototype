package com.tripwise.dto;

import lombok.Data;

@Data
public class BookingRequest {
    private String userId;
    private String bookingType;
    private String destination;
    private String origin;
    private String startDate;
    private String endDate;
    private Integer numberOfPassengers;
    private String preferences;
}
