package com.tripwise.dto;

import jakarta.validation.constraints.NotBlank;

public class TravelResearchRequest {
    
    @NotBlank(message = "Destination is required")
    private String destination;
    
    @NotBlank(message = "User message is required")
    private String userMessage;
    
    @NotBlank(message = "Budget is required")
    private String budget;
    
    private TravelResearchResponse travelResearchResponse;
    
    public TravelResearchRequest() {}
    
    public TravelResearchRequest(String destination, String userMessage, String budget, TravelResearchResponse travelResearchResponse) {
        this.destination = destination;
        this.userMessage = userMessage;
        this.budget = budget;
        this.travelResearchResponse = travelResearchResponse;
    }
    
    public String getDestination() {
        return destination;
    }
    
    public void setDestination(String destination) {
        this.destination = destination;
    }
    
    public String getUserMessage() {
        return userMessage;
    }
    
    public void setUserMessage(String userMessage) {
        this.userMessage = userMessage;
    }
    
    public String getBudget() {
        return budget;
    }
    
    public void setBudget(String budget) {
        this.budget = budget;
    }
    
    public TravelResearchResponse getTravelResearchResponse() {
        return travelResearchResponse;
    }
    
    public void setTravelResearchResponse(TravelResearchResponse travelResearchResponse) {
        this.travelResearchResponse = travelResearchResponse;
    }
}
