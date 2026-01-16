package com.tripwise.dto;

public class TravelResearchResponse {
    
    private String destination;
    private String researchNotes;
    
    public TravelResearchResponse() {}
    
    public TravelResearchResponse(String destination, String researchNotes) {
        this.destination = destination;
        this.researchNotes = researchNotes;
    }
    
    public String getDestination() {
        return destination;
    }
    
    public void setDestination(String destination) {
        this.destination = destination;
    }
    
    public String getResearchNotes() {
        return researchNotes;
    }
    
    public void setResearchNotes(String researchNotes) {
        this.researchNotes = researchNotes;
    }
}
