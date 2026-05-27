package com.tripwise.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import java.time.LocalDateTime;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "trips")
public class Trip {

    @Id
    private String id;

    @Field("profileId")
    private String profileId;

    @Field("destination")
    private String destination;

    @Field("startDate")
    private String startDate;

    @Field("endDate")
    private String endDate;

    @Field("dates")
    private String dates; // Display string like "Jun 12 - Jun 19, 2024"

    @Field("status")
    private String status; // upcoming, completed, cancelled

    @Field("bookingReference")
    private String bookingReference; // e.g., TW-8842

    @Field("estimatedCost")
    private BigDecimal estimatedCost;

    @Field("currency")
    private String currency; // Default: INR

    @Field("createdAt")
    private LocalDateTime createdAt;

    @Field("updatedAt")
    private LocalDateTime updatedAt;

    @Field("passShareToken")
    private String passShareToken;
}
