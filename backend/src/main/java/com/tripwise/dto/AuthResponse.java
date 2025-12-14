package com.tripwise.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private Long userId;
    private Boolean isFirstTime;
    private String message;
    private UserDetailsDTO userDetails;
}
