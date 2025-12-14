package com.tripwise.service;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

@Service
public class GoogleMapsService {

    @Value("${google.maps.api.key:}")
    private String apiKey;

    private final HttpClient httpClient = HttpClient.newHttpClient();
    private final Gson gson = new Gson();

    public List<JsonObject> searchPlaces(String location, String placeType) throws Exception {
        if (apiKey == null || apiKey.isEmpty()) {
            return getMockPlaces(location);
        }

        String encodedLocation = URLEncoder.encode(location, StandardCharsets.UTF_8);
        String encodedType = URLEncoder.encode(placeType, StandardCharsets.UTF_8);
        
        String url = String.format(
            "https://maps.googleapis.com/maps/api/place/textsearch/json?query=%s+%s&key=%s",
            encodedLocation, encodedType, apiKey
        );

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .GET()
                .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        JsonObject jsonResponse = gson.fromJson(response.body(), JsonObject.class);
        
        List<JsonObject> places = new ArrayList<>();
        JsonArray results = jsonResponse.getAsJsonArray("results");
        
        if (results != null) {
            for (int i = 0; i < Math.min(5, results.size()); i++) {
                places.add(results.get(i).getAsJsonObject());
            }
        }
        
        return places;
    }

    private List<JsonObject> getMockPlaces(String location) {
        List<JsonObject> mockPlaces = new ArrayList<>();
        
        JsonObject place1 = new JsonObject();
        place1.addProperty("name", "Tourist Attraction in " + location);
        place1.addProperty("rating", 4.5);
        place1.addProperty("vicinity", location);
        mockPlaces.add(place1);
        
        JsonObject place2 = new JsonObject();
        place2.addProperty("name", "Historic Site in " + location);
        place2.addProperty("rating", 4.7);
        place2.addProperty("vicinity", location);
        mockPlaces.add(place2);
        
        return mockPlaces;
    }
}
