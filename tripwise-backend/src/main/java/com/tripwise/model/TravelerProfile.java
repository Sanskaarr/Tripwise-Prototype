package com.tripwise.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "traveler_profiles")
public class TravelerProfile {

    @Id
    private String id;

    @Field("profileId")
    private String profileId;

    @Field("createdAt")
    private LocalDateTime createdAt;

    @Field("updatedAt")
    private LocalDateTime updatedAt;

    @Field("status")
    private String status;

    @Field("basicInfo")
    private BasicInfo basicInfo;

    @Field("dates")
    private TravelDates dates;

    @Field("destination")
    private Destination destination;

    @Field("budget")
    private Budget budget;

    @Field("accommodation")
    private Accommodation accommodation;

    @Field("transport")
    private Transport transport;

    @Field("purpose")
    private Purpose purpose;

    @Field("interests")
    private Interests interests;

    @Field("food")
    private Food food;

    @Field("documents")
    private Documents documents;

    @Field("experience")
    private Experience experience;

    @Field("communication")
    private Communication communication;

    @Field("generatedPlan")
    private String generatedPlan;

    @Field("planGeneratedAt")
    private LocalDateTime planGeneratedAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BasicInfo {
        private String fullName;
        private String whatsappNumber;
        private String email;
        private String cityOfDeparture;
        private Integer adults;
        private Integer children;
        private Integer infants;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TravelDates {
        private String startDate;
        private String returnDate;
        private Boolean isFlexible;
        private Integer duration;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Destination {
        private String destination;
        private String travelType;
        private String preferenceType;
        private Boolean isFirstVisit;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Budget {
        private String level;
        private String includesFlights;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Accommodation {
        private String category;
        private String roomType;
        private List<String> specialNeeds;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Transport {
        private String mode;
        private String timingPreference;
        private Boolean pickupDrop;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Purpose {
        private String purpose;
        private String specialOccasion;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Interests {
        private Boolean sightseeing;
        private Boolean relaxation;
        private Boolean adventure;
        private Boolean shopping;
        private Boolean nature;
        private Boolean food;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Food {
        private String type;
        private String allergies;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Documents {
        private Boolean hasPassport;
        private String passportExpiry;
        private String visaAwareness;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Experience {
        private String frequency;
        private String badExperiences;
    }

    @Field("coTravelers")
    private List<CoTraveler> coTravelers;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CoTraveler {
        private String id;
        private String name;
        private String relation;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Communication {
        private String method;
        private String bestTime;
    }
}
