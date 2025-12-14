package com.tripwise.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookingOption {
    private String optionId;
    private String name;
    private String description;
    private Double price;
    private String departureTime;
    private String arrivalTime;
    private String duration;
    private String rating;
}
