package com.tripwise.dto;

public class UserDetailsDTO {
    private String email;
    private String phoneNumber;
    private String preferredLanguage;
    private String budgetRange;
    private String travelStyle;
    private String dietaryPreferences;
    private String interests;

    public UserDetailsDTO() {}

    public UserDetailsDTO(String email, String phoneNumber, String preferredLanguage, 
                         String budgetRange, String travelStyle, String dietaryPreferences, 
                         String interests) {
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.preferredLanguage = preferredLanguage;
        this.budgetRange = budgetRange;
        this.travelStyle = travelStyle;
        this.dietaryPreferences = dietaryPreferences;
        this.interests = interests;
    }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    public String getPreferredLanguage() { return preferredLanguage; }
    public void setPreferredLanguage(String preferredLanguage) { this.preferredLanguage = preferredLanguage; }
    public String getBudgetRange() { return budgetRange; }
    public void setBudgetRange(String budgetRange) { this.budgetRange = budgetRange; }
    public String getTravelStyle() { return travelStyle; }
    public void setTravelStyle(String travelStyle) { this.travelStyle = travelStyle; }
    public String getDietaryPreferences() { return dietaryPreferences; }
    public void setDietaryPreferences(String dietaryPreferences) { this.dietaryPreferences = dietaryPreferences; }
    public String getInterests() { return interests; }
    public void setInterests(String interests) { this.interests = interests; }
}
