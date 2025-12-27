package com.tripwise.dto;

public class PlaceDetails {
    private String placeId;
    private String name;
    private String address;
    private Double latitude;
    private Double longitude;
    private Double rating;
    private String types;
    private String photoReference;

    public PlaceDetails() {}

    public PlaceDetails(String placeId, String name, String address, Double latitude,
                       Double longitude, Double rating, String types, String photoReference) {
        this.placeId = placeId;
        this.name = name;
        this.address = address;
        this.latitude = latitude;
        this.longitude = longitude;
        this.rating = rating;
        this.types = types;
        this.photoReference = photoReference;
    }

    public String getPlaceId() { return placeId; }
    public void setPlaceId(String placeId) { this.placeId = placeId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }
    public String getTypes() { return types; }
    public void setTypes(String types) { this.types = types; }
    public String getPhotoReference() { return photoReference; }
    public void setPhotoReference(String photoReference) { this.photoReference = photoReference; }
}
