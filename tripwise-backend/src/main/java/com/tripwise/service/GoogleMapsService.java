package com.tripwise.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tripwise.dto.PlaceDetails;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

@Service
public class GoogleMapsService {
    private static final Logger logger = LoggerFactory.getLogger(GoogleMapsService.class);
    
    @Value("${google.maps.api.key:}")
    private String apiKey;
    
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    
    public GoogleMapsService(@Qualifier("googleMapsRestTemplate") RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
        this.objectMapper = new ObjectMapper();
    }
    
    public List<PlaceDetails> searchPlaces(String query, String location) {
        if (apiKey == null || apiKey.isEmpty()) {
            logger.warn("Google Maps API key not configured, returning empty results");
            return new ArrayList<>();
        }
        
        try {
            String url = String.format(
                "https://maps.googleapis.com/maps/api/place/textsearch/json?query=%s&location=%s&key=%s",
                query.replace(" ", "+"), location, apiKey
            );
            
            String response = restTemplate.getForObject(url, String.class);
            JsonNode root = objectMapper.readTree(response);
            
            List<PlaceDetails> places = new ArrayList<>();
            JsonNode results = root.get("results");
            
            if (results != null && results.isArray()) {
                for (JsonNode result : results) {
                    PlaceDetails place = new PlaceDetails();
                    place.setPlaceId(result.get("place_id").asText());
                    place.setName(result.get("name").asText());
                    place.setAddress(result.has("formatted_address") ? result.get("formatted_address").asText() : "");
                    
                    JsonNode geometry = result.get("geometry");
                    if (geometry != null) {
                        JsonNode locationNode = geometry.get("location");
                        place.setLatitude(locationNode.get("lat").asDouble());
                        place.setLongitude(locationNode.get("lng").asDouble());
                    }
                    
                    place.setRating(result.has("rating") ? result.get("rating").asDouble() : 0.0);
                    place.setTypes(result.has("types") ? result.get("types").toString() : "");
                    
                    JsonNode photos = result.get("photos");
                    if (photos != null && photos.isArray() && photos.size() > 0) {
                        place.setPhotoReference(photos.get(0).get("photo_reference").asText());
                    }
                    
                    places.add(place);
                }
            }
            
            return places;
        } catch (Exception e) {
            logger.error("Error fetching places from Google Maps: {}", e.getMessage());
            return new ArrayList<>();
        }
    }
    
    public PlaceDetails geocodeAddress(String address) {
        if (apiKey == null || apiKey.isEmpty()) {
            logger.warn("Google Maps API key not configured");
            return null;
        }
        
        try {
            String url = String.format(
                "https://maps.googleapis.com/maps/api/geocode/json?address=%s&key=%s",
                address.replace(" ", "+"), apiKey
            );
            
            String response = restTemplate.getForObject(url, String.class);
            JsonNode root = objectMapper.readTree(response);
            
            JsonNode results = root.get("results");
            if (results != null && results.isArray() && results.size() > 0) {
                JsonNode result = results.get(0);
                PlaceDetails place = new PlaceDetails();
                
                place.setAddress(result.get("formatted_address").asText());
                place.setPlaceId(result.get("place_id").asText());
                
                JsonNode geometry = result.get("geometry");
                if (geometry != null) {
                    JsonNode location = geometry.get("location");
                    place.setLatitude(location.get("lat").asDouble());
                    place.setLongitude(location.get("lng").asDouble());
                }
                
                return place;
            }
        } catch (Exception e) {
            logger.error("Error geocoding address: {}", e.getMessage());
        }
        
        return null;
    }
    
    public String getDirections(String origin, String destination, String mode) {
        if (apiKey == null || apiKey.isEmpty()) {
            logger.warn("Google Maps API key not configured");
            return null;
        }
        
        try {
            String url = String.format(
                "https://maps.googleapis.com/maps/api/directions/json?origin=%s&destination=%s&mode=%s&key=%s",
                origin.replace(" ", "+"), destination.replace(" ", "+"), mode, apiKey
            );
            
            String response = restTemplate.getForObject(url, String.class);
            JsonNode root = objectMapper.readTree(response);
            
            JsonNode routes = root.get("routes");
            if (routes != null && routes.isArray() && routes.size() > 0) {
                JsonNode route = routes.get(0);
                JsonNode legs = route.get("legs");
                
                if (legs != null && legs.isArray() && legs.size() > 0) {
                    JsonNode leg = legs.get(0);
                    
                    String distance = leg.get("distance").get("text").asText();
                    String duration = leg.get("duration").get("text").asText();
                    
                    return String.format("Distance: %s, Duration: %s", distance, duration);
                }
            }
        } catch (Exception e) {
            logger.error("Error fetching directions: {}", e.getMessage());
        }
        
        return null;
    }
}