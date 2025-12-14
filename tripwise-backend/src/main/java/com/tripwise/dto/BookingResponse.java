package com.tripwise.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookingResponse {
    private String bookingId;
    private String bookingType;
    private String status;
    private Double totalPrice;
    private String currency;
    private List<BookingOption> options;
    private String message;
}
