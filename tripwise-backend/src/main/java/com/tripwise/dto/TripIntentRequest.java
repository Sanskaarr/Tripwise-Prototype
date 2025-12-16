package com.tripwise.dto;

public class TripIntentRequest {
    private String userId;
    private String userInput;
    private String language;

    public TripIntentRequest() {}

    public TripIntentRequest(String userId, String userInput, String language) {
        this.userId = userId;
        this.userInput = userInput;
        this.language = language;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getUserInput() {
        return userInput;
    }

    public void setUserInput(String userInput) {
        this.userInput = userInput;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }
}
