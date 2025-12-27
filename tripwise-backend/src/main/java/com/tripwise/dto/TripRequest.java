package com.tripwise.dto;

import java.util.List;

public class TripRequest {
    private String destination;
    private String startDate;
    private String endDate;
    private List<String> interests;
    private String budget;
    private int travelers;

    // Getters and Setters
    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }
    public String getStartDate() { return startDate; }
    public void setStartDate(String startDate) { this.startDate = startDate; }
    public String getEndDate() { return endDate; }
    public void setEndDate(String endDate) { this.endDate = endDate; }
    public List<String> getInterests() { return interests; }
    public void setInterests(List<String> interests) { this.interests = interests; }
    public String getBudget() { return budget; }
    public void setBudget(String budget) { this.budget = budget; }
    public int getTravelers() { return travelers; }
    public void setTravelers(int travelers) { this.travelers = travelers; }
}
