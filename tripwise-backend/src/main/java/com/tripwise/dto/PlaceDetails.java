package com.tripwise.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PlaceDetails {
    private String placeId;
    private String name;
    private String address;
    private Double latitude;
    private Double longitude;
    private Double rating;
    private String types;
    private String photoReference;
}
