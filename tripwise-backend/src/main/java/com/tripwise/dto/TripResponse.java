package com.tripwise.dto;

public class TripResponse {
    
    private String response;
    private boolean isValid;
    private String validationMessage;
    
    public TripResponse() {}
    
    public TripResponse(String response) {
        this.response = response;
        this.isValid = true;
    }
    
    public TripResponse(String response, boolean isValid, String validationMessage) {
        this.response = response;
        this.isValid = isValid;
        this.validationMessage = validationMessage;
    }
    
    public String getResponse() {
        return response;
    }
    
    public void setResponse(String response) {
        this.response = response;
    }
    
    public boolean isValid() {
        return isValid;
    }
    
    public void setValid(boolean valid) {
        isValid = valid;
    }
    
    public String getValidationMessage() {
        return validationMessage;
    }
    
    public void setValidationMessage(String validationMessage) {
        this.validationMessage = validationMessage;
    }
}
