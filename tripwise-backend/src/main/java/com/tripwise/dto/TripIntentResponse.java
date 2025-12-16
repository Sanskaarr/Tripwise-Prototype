package com.tripwise.dto;

public class TripIntentResponse {
    private String suggestion;
    private String message;

    public TripIntentResponse() {}

    public TripIntentResponse(String suggestion, String message) {
        this.suggestion = suggestion;
        this.message = message;
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
}
