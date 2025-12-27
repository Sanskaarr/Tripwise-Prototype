package com.tripwise.dto;

public class AuthResponse {
    private String token;
    private String userId;
    private Boolean isFirstTime;
    private String message;
    private UserDetailsDTO userDetails;

    public AuthResponse(String token, String userId, Boolean isFirstTime, String message, UserDetailsDTO userDetails) {
        this.token = token;
        this.userId = userId;
        this.isFirstTime = isFirstTime;
        this.message = message;
        this.userDetails = userDetails;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public Boolean getIsFirstTime() {
        return isFirstTime;
    }

    public void setIsFirstTime(Boolean isFirstTime) {
        this.isFirstTime = isFirstTime;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public UserDetailsDTO getUserDetails() {
        return userDetails;
    }

    public void setUserDetails(UserDetailsDTO userDetails) {
        this.userDetails = userDetails;
    }
}
