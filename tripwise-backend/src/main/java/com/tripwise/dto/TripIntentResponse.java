package com.tripwise.dto;

public class TripIntentResponse {
    private String suggestion;
    private String message;
    private String overview;
    private String duration;
    private String budget;
    private String itinerary;
    private String recommendations;

    public TripIntentResponse() {}

    public TripIntentResponse(String suggestion, String message) {
        this.suggestion = suggestion;
        this.message = message;
    }

    public TripIntentResponse(String suggestion, String message, String overview, String duration, String budget, String itinerary, String recommendations) {
        this.suggestion = suggestion;
        this.message = message;
        this.overview = overview;
        this.duration = duration;
        this.budget = budget;
        this.itinerary = itinerary;
        this.recommendations = recommendations;
    }

    public String getSuggestion() {
        return suggestion;
    }

    public void setSuggestion(String suggestion) {
        this.suggestion = suggestion;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getOverview() {
        return overview;
    }

    public void setOverview(String overview) {
        this.overview = overview;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public String getBudget() {
        return budget;
    }

    public void setBudget(String budget) {
        this.budget = budget;
    }

    public String getItinerary() {
        return itinerary;
    }

    public void setItinerary(String itinerary) {
        this.itinerary = itinerary;
    }

    public String getRecommendations() {
        return recommendations;
    }

    public void setRecommendations(String recommendations) {
        this.recommendations = recommendations;
    }
}
