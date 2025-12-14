package com.tripwise.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String email;
    private String password;
    private String phoneNumber;
    private String preferredLanguage;
    private String budgetRange;
    private String travelStyle;
    private String dietaryPreferences;
    private String interests;
}