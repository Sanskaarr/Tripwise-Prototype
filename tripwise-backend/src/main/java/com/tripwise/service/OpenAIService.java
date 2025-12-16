package com.tripwise.service;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import okhttp3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.concurrent.TimeUnit;

@Service
public class OpenAIService {

    @Value("${openai.api.key:}")
    private String openaiApiKey;

    private static final String OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
    private final OkHttpClient client;
    private final Gson gson;

    public OpenAIService() {
        this.client = new OkHttpClient.Builder()
                .connectTimeout(30, TimeUnit.SECONDS)
                .readTimeout(30, TimeUnit.SECONDS)
                .writeTimeout(30, TimeUnit.SECONDS)
                .build();
        this.gson = new Gson();
    }

    public String generateTravelSuggestion(String userInput, String userContext, String language) {
        if (openaiApiKey == null || openaiApiKey.isBlank()) {
            return generateFallbackSuggestion(userInput);
        }

        try {
            String systemPrompt = buildSystemPrompt(language);
            String userPrompt = buildUserPrompt(userInput, userContext);

            JsonObject requestBody = new JsonObject();
            requestBody.addProperty("model", "gpt-4o");
            requestBody.addProperty("temperature", 0.7);
            requestBody.addProperty("max_tokens", 1000);

            JsonArray messages = new JsonArray();
            
            JsonObject systemMessage = new JsonObject();
            systemMessage.addProperty("role", "system");
            systemMessage.addProperty("content", systemPrompt);
            messages.add(systemMessage);

            JsonObject userMessage = new JsonObject();
            userMessage.addProperty("role", "user");
            userMessage.addProperty("content", userPrompt);
            messages.add(userMessage);

            requestBody.add("messages", messages);

            RequestBody body = RequestBody.create(
                    requestBody.toString(),
                    MediaType.parse("application/json")
            );

            Request request = new Request.Builder()
                    .url(OPENAI_API_URL)
                    .addHeader("Authorization", "Bearer " + openaiApiKey)
                    .addHeader("Content-Type", "application/json")
                    .post(body)
                    .build();

            try (Response response = client.newCall(request).execute()) {
                if (!response.isSuccessful()) {
                    System.err.println("OpenAI API error: " + response.code());
                    return generateFallbackSuggestion(userInput);
                }

                String responseBody = response.body().string();
                JsonObject jsonResponse = gson.fromJson(responseBody, JsonObject.class);
                
                return jsonResponse
                        .getAsJsonArray("choices")
                        .get(0).getAsJsonObject()
                        .getAsJsonObject("message")
                        .get("content").getAsString();
            }
        } catch (IOException e) {
            System.err.println("Error calling OpenAI API: " + e.getMessage());
            return generateFallbackSuggestion(userInput);
        }
    }

    private String buildSystemPrompt(String language) {
        return String.format(
                "You are TripWise AI, a friendly and knowledgeable travel planning assistant. " +
                "Your role is to help users plan their trips based on their natural language descriptions. " +
                "Respond in %s language if specified, otherwise use English. " +
                "Provide personalized travel suggestions including:\n" +
                "- Trip summary and destination highlights\n" +
                "- Suggested itinerary outline (day-by-day if duration is mentioned)\n" +
                "- Estimated budget range in INR (₹)\n" +
                "- High-level recommendations for activities, food, and experiences\n" +
                "Keep the tone conversational, warm, and helpful. " +
                "Format your response in clear sections with proper spacing. " +
                "Do not include booking links or specific hotel/flight details at this stage.",
                language
        );
    }

    private String buildUserPrompt(String userInput, String userContext) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("User's travel request: ").append(userInput).append("\n\n");
        
        if (userContext != null && !userContext.isBlank()) {
            prompt.append("User's profile and preferences:\n").append(userContext).append("\n\n");
        }
        
        prompt.append("Please provide a personalized travel suggestion based on the above information.");
        
        return prompt.toString();
    }

    private String generateFallbackSuggestion(String userInput) {
        return "Thank you for your interest in planning a trip! 🌏\n\n" +
                "Your request: " + userInput + "\n\n" +
                "I'd love to help you plan this journey! To provide personalized recommendations, " +
                "our AI travel assistant needs to be configured. In the meantime, here's what we suggest:\n\n" +
                "✨ Trip Planning Tips:\n" +
                "• Research your destination's weather and best travel season\n" +
                "• Book accommodations and transport in advance for better rates\n" +
                "• Create a flexible itinerary with must-see attractions\n" +
                "• Set aside budget for unexpected experiences\n\n" +
                "📍 Next Steps:\n" +
                "Continue to booking to explore available travel and accommodation options " +
                "tailored to your preferences.\n\n" +
                "Our team is working to enhance your experience with AI-powered suggestions!";
    }
}
