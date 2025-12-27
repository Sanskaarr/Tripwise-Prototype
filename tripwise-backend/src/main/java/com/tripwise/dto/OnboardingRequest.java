package com.tripwise.dto;

public class OnboardingRequest {
    private String userId;
    private String preferredLanguage;
    private String budgetRange;
    private String travelStyle;
    private String dietaryPreferences;
    private String interests;
    private String pastTravelExperience;
    private String communicationPreference;
    private String documentsReady;
    private String email;

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getPreferredLanguage() {
        return preferredLanguage;
    }

    public void setPreferredLanguage(String preferredLanguage) {
        this.preferredLanguage = preferredLanguage;
    }

    public String getBudgetRange() {
        return budgetRange;
    }

    public void setBudgetRange(String budgetRange) {
        this.budgetRange = budgetRange;
    }

    public String getTravelStyle() {
        return travelStyle;
    }

    public void setTravelStyle(String travelStyle) {
        this.travelStyle = travelStyle;
    }

    public String getDietaryPreferences() {
        return dietaryPreferences;
    }

    public void setDietaryPreferences(String dietaryPreferences) {
        this.dietaryPreferences = dietaryPreferences;
    }

    public String getInterests() {
        return interests;
    }

    public void setInterests(String interests) {
        this.interests = interests;
    }

    public String getPastTravelExperience() {
        return pastTravelExperience;
    }

    public void setPastTravelExperience(String pastTravelExperience) {
        this.pastTravelExperience = pastTravelExperience;
    }

    public String getCommunicationPreference() {
        return communicationPreference;
    }

    public void setCommunicationPreference(String communicationPreference) {
        this.communicationPreference = communicationPreference;
    }

    public String getDocumentsReady() {
        return documentsReady;
    }

    public void setDocumentsReady(String documentsReady) {
        this.documentsReady = documentsReady;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
