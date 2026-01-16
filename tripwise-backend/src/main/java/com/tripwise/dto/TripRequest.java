package com.tripwise.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;

public class TripRequest {
    
    @NotBlank(message = "Destination is required")
    private String destination;
    
    @Min(value = 1, message = "Days must be at least 1")
    @Max(value = 30, message = "Days cannot exceed 30")
    private int days;
    
    @NotBlank(message = "Budget level is required")
    private String budgetLevel; // low, medium, high
    
    @NotBlank(message = "Travel style is required")
    private String travelStyle; // balanced, adventure, relaxed, cultural
    
    @NotBlank(message = "User country is required")
    private String userCountry;
    
    public TripRequest() {}
    
    public TripRequest(String destination, int days, String budgetLevel, String travelStyle, String userCountry) {
        this.destination = destination;
        this.days = days;
        this.budgetLevel = budgetLevel;
        this.travelStyle = travelStyle;
        this.userCountry = userCountry;
    }
    
    public String getDestination() {
        return destination;
    }
    
    public void setDestination(String destination) {
        this.destination = destination;
    }
    
    public int getDays() {
        return days;
    }
    
    public void setDays(int days) {
        this.days = days;
    }
    
    public String getBudgetLevel() {
        return budgetLevel;
    }
    
    public void setBudgetLevel(String budgetLevel) {
        this.budgetLevel = budgetLevel;
    }
    
    public String getTravelStyle() {
        return travelStyle;
    }
    
    public void setTravelStyle(String travelStyle) {
        this.travelStyle = travelStyle;
    }
    
    public String getUserCountry() {
        return userCountry;
    }
    
    public void setUserCountry(String userCountry) {
        this.userCountry = userCountry;
    }
}
