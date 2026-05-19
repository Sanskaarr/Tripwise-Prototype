package com.tripwise.model;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "tripwise_bookings")
public class TripwiseBooking {

    @Id
    private String id;

    // Cryptographically random token used for public booking lookup (shareable link).
    // The MongoDB _id is never exposed publicly.
    @Indexed(unique = true, sparse = true)
    @Field("shareToken")
    private String shareToken;

    @Field("sessionId")
    private String sessionId;

    @Field("profileId")
    private String profileId;

    @Field("destination")
    private String destination;

    // Mock PNRs generated after payment
    @Field("flightPnr")
    private String flightPnr;

    @Field("hotelRef")
    private String hotelRef;

    @Field("transportRef")
    private String transportRef;

    // Selections from the planning wizard
    @Field("hotelName")
    private String hotelName;

    @Field("hotelAddress")
    private String hotelAddress;

    @Field("transportMode")
    private String transportMode;

    @Field("checkInDate")
    private String checkInDate;

    @Field("checkOutDate")
    private String checkOutDate;

    // Gemini-generated arrival transport details
    @Field("transportType")
    private String transportType;

    @Field("airline")
    private String airline;

    @Field("transportNumber")
    private String transportNumber;

    @Field("fromCity")
    private String fromCity;

    @Field("toCity")
    private String toCity;

    @Field("transportDate")
    private String transportDate;

    @Field("departureTime")
    private String departureTime;

    @Field("arrivalTime")
    private String arrivalTime;

    @Field("platform")
    private String platform;

    @Field("seatOrCoach")
    private String seatOrCoach;

    @Field("travelClass")
    private String travelClass;

    // Gemini-generated return transport
    @Field("returnTransportNumber")
    private String returnTransportNumber;

    @Field("returnPnr")
    private String returnPnr;

    @Field("returnDate")
    private String returnDate;

    @Field("returnDepartureTime")
    private String returnDepartureTime;

    @Field("returnArrivalTime")
    private String returnArrivalTime;

    @Field("returnSeat")
    private String returnSeat;

    // Gemini-generated hotel details
    @Field("hotelConfirmationRef")
    private String hotelConfirmationRef;

    @Field("roomType")
    private String roomType;

    @Field("hotelCheckInTime")
    private String hotelCheckInTime;

    @Field("hotelCheckOutTime")
    private String hotelCheckOutTime;

    // Gemini-generated local transport
    @Field("localTransportOperator")
    private String localTransportOperator;

    @Field("localTransportBookingRef")
    private String localTransportBookingRef;

    // Payment info
    @Field("totalAmount")
    private String totalAmount;

    @Field("razorpayPaymentId")
    private String razorpayPaymentId;

    @Field("razorpayOrderId")
    private String razorpayOrderId;

    @Field("status")
    private BookingStatus status;

    @Field("createdAt")
    private LocalDateTime createdAt;

    @Field("updatedAt")
    private LocalDateTime updatedAt;

    public enum BookingStatus {
        PENDING,
        CONFIRMED,
        CANCELLED
    }
}
