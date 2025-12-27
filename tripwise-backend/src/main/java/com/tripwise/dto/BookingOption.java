package com.tripwise.dto;

public class BookingOption {
    private String optionId;
    private String name;
    private String description;
    private Double price;
    private String departureTime;
    private String arrivalTime;
    private String duration;
    private String rating;

    public BookingOption() {}

    public BookingOption(String optionId, String name, String description, Double price,
                        String departureTime, String arrivalTime, String duration, String rating) {
        this.optionId = optionId;
        this.name = name;
        this.description = description;
        this.price = price;
        this.departureTime = departureTime;
        this.arrivalTime = arrivalTime;
        this.duration = duration;
        this.rating = rating;
    }

    public String getOptionId() { return optionId; }
    public void setOptionId(String optionId) { this.optionId = optionId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
    public String getDepartureTime() { return departureTime; }
    public void setDepartureTime(String departureTime) { this.departureTime = departureTime; }
    public String getArrivalTime() { return arrivalTime; }
    public void setArrivalTime(String arrivalTime) { this.arrivalTime = arrivalTime; }
    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }
    public String getRating() { return rating; }
    public void setRating(String rating) { this.rating = rating; }
}
