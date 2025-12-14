package com.tripwise.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDetailsDTO {
    private String email;
    private String phoneNumber;
    private String preferredLanguage;
    private String budgetRange;
    private String travelStyle;
    private String dietaryPreferences;
    private String interests;
}