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

    @Value("${gemini.api.url}")
    private String apiUrlTemplate;

    @Value("${gemini.model}")
    private String model;

    private final HttpClient httpClient = HttpClient.newHttpClient();
    private final Gson gson = new Gson();

    public String generateLocalGuide(String location, String language) throws Exception {
        if (apiKey == null || apiKey.isEmpty()) {
            return generateMockGuide(location);
        }

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

        String url = String.format(apiUrlTemplate, model, apiKey);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(gson.toJson(requestBody)))
                .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        
        if (response.statusCode() != 200) {
            throw new RuntimeException("Gemini API error: " + response.statusCode() + " - " + response.body());
        }

        JsonObject jsonResponse = gson.fromJson(response.body(), JsonObject.class);
        return jsonResponse.getAsJsonArray("candidates")
                .get(0).getAsJsonObject()
                .getAsJsonObject("content")
                .getAsJsonArray("parts")
                .get(0).getAsJsonObject()
                .get("text").getAsString();
    }

    private String generateMockGuide(String location) {
        return String.format(
            "## Welcome to %s!\n\n" +
            "### Top Places to Visit\n" +
            "1. Main Beach - Beautiful sunset views\n" +
            "2. Old Town Walking Trail - Historic architecture\n" +
            "3. Local Market - Handcrafted souvenirs\n" +
            "4. Nature Reserve - Wildlife spotting\n" +
            "5. Temple District - Cultural immersion\n\n" +
            "### Local Food & Restaurants\n" +
            "- Traditional thali spots for authentic cuisine\n" +
            "- Evening street food lanes\n" +
            "- Beachside cafes with fresh seafood\n\n" +
            "### Cultural Etiquette\n" +
            "- Dress modestly when visiting temples\n" +
            "- Remove shoes before entering sacred places\n" +
            "- Ask permission before photographing locals\n\n" +
            "### Safety Tips\n" +
            "- Emergency: 112\n" +
            "- Keep valuables secure\n" +
            "- Stay hydrated in hot weather\n\n" +
            "### Transportation\n" +
            "- Local buses and auto-rickshaws available\n" +
            "- Taxi apps work in most areas\n" +
            "- Rent scooters for flexibility",
            location
        );
    }
}
