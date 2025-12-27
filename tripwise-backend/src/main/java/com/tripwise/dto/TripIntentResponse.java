package com.tripwise.dto;

public class TripIntentResponse {
    private String suggestion;
    private String message;
    private String tripOverview;
    private String suggestedDuration;
    private String budgetRange;
    private String itineraryOutline;
    private String recommendations;

    public TripIntentResponse() {}

    public TripIntentResponse(String suggestion, String message) {
        this.suggestion = suggestion;
        this.message = message;
    }

    public TripIntentResponse(String suggestion,
                             String message,
                             String tripOverview,
                             String suggestedDuration,
                             String budgetRange,
                             String itineraryOutline,
                             String recommendations) {
        this.suggestion = suggestion;
        this.message = message;
        this.tripOverview = tripOverview;
        this.suggestedDuration = suggestedDuration;
        this.budgetRange = budgetRange;
        this.itineraryOutline = itineraryOutline;
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

    public String getTripOverview() {
        return tripOverview;
    }

    public void setTripOverview(String tripOverview) {
        this.tripOverview = tripOverview;
    }

    public String getSuggestedDuration() {
        return suggestedDuration;
    }

    public void setSuggestedDuration(String suggestedDuration) {
        this.suggestedDuration = suggestedDuration;
    }

    public String getBudgetRange() {
        return budgetRange;
    }

    public void setBudgetRange(String budgetRange) {
        this.budgetRange = budgetRange;
    }

    public String getItineraryOutline() {
        return itineraryOutline;
    }

    public void setItineraryOutline(String itineraryOutline) {
        this.itineraryOutline = itineraryOutline;
    }

    public String getRecommendations() {
        return recommendations;
    }

    public void setRecommendations(String recommendations) {
        this.recommendations = recommendations;
    }
}
