package com.tripwise.service;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@Service
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    private final HttpClient httpClient = HttpClient.newHttpClient();
    private final Gson gson = new Gson();

    public String generateLocalGuide(String location, String language) throws Exception {
        String prompt = String.format(
            "Provide a comprehensive local guide for %s in %s language. Include: " +
            "1) Top places to visit (5-7 recommendations) " +
            "2) Local food and restaurants " +
            "3) Cultural etiquette and rules " +
            "4) Safety tips " +
            "5) Transportation options " +
            "Format the response in a clear, structured way.",
            location, language
        );

        JsonObject content = new JsonObject();
        JsonObject part = new JsonObject();
        part.addProperty("text", prompt);
        content.add("parts", gson.toJsonTree(new JsonObject[]{part}));

        JsonObject requestBody = new JsonObject();
        requestBody.add("contents", gson.toJsonTree(new JsonObject[]{content}));

        String url = String.format(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=%s",
            apiKey
        );

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(gson.toJson(requestBody)))
                .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        
        JsonObject jsonResponse = gson.fromJson(response.body(), JsonObject.class);
        return jsonResponse.getAsJsonArray("candidates")
                .get(0).getAsJsonObject()
                .getAsJsonObject("content")
                .getAsJsonArray("parts")
                .get(0).getAsJsonObject()
                .get("text").getAsString();
    }
}
