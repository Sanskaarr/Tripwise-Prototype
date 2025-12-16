package com.tripwise.service;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.tripwise.dto.TripIntentResponse;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
public class GeminiIntentService {

    @Value("${gemini.api.key:}")
    private String geminiApiKey;

    @Value("${gemini.model:gemini-1.5-flash}")
    private String geminiModel;

    @Value("${gemini.api.url:https://generativelanguage.googleapis.com/v1beta/models}")
    private String geminiApiBase;

    private static final MediaType JSON = MediaType.parse("application/json");
    private final OkHttpClient client;
    private final Gson gson;

    public GeminiIntentService() {
        this.client = new OkHttpClient.Builder()
                .connectTimeout(30, TimeUnit.SECONDS)
                .readTimeout(30, TimeUnit.SECONDS)
                .writeTimeout(30, TimeUnit.SECONDS)
                .build();
        this.gson = new Gson();
    }

    public TripIntentResponse generateTravelSuggestion(String userInput, String userContext, String language) {
        if (geminiApiKey == null || geminiApiKey.isBlank()) {
            return buildFallbackResponse(userInput);
        }

        try {
            String apiUrl = String.format("%s/%s:generateContent?key=%s", geminiApiBase, geminiModel, geminiApiKey);
            String prompt = buildPrompt(userInput, userContext, language);

            JsonObject requestBody = new JsonObject();
            JsonArray contents = new JsonArray();
            JsonObject content = new JsonObject();
            JsonArray parts = new JsonArray();
            JsonObject part = new JsonObject();
            part.addProperty("text", prompt);
            parts.add(part);
            content.add("parts", parts);
            content.addProperty("role", "user");
            contents.add(content);
            requestBody.add("contents", contents);

            JsonObject generationConfig = new JsonObject();
            generationConfig.addProperty("temperature", 0.6);
            generationConfig.addProperty("maxOutputTokens", 800);
            generationConfig.addProperty("responseMimeType", "application/json");
            requestBody.add("generationConfig", generationConfig);

            RequestBody body = RequestBody.create(requestBody.toString(), JSON);
            Request request = new Request.Builder()
                    .url(apiUrl)
                    .post(body)
                    .addHeader("Content-Type", "application/json")
                    .build();

            try (Response response = client.newCall(request).execute()) {
                if (!response.isSuccessful()) {
                    System.err.println("Gemini API error: " + response.code());
                    return buildFallbackResponse(userInput);
                }

                String responseBody = response.body() != null ? response.body().string() : "";
                JsonObject jsonResponse = gson.fromJson(responseBody, JsonObject.class);
                String textPayload = extractTextPayload(jsonResponse);
                if (textPayload == null || textPayload.isBlank()) {
                    return buildFallbackResponse(userInput);
                }

                TripIntentResponse parsed = parseStructuredResponse(textPayload, userInput);
                if (parsed.getSuggestion() == null || parsed.getSuggestion().isBlank()) {
                    return buildFallbackResponse(userInput);
                }
                return parsed;
            }
        } catch (IOException e) {
            System.err.println("Error calling Gemini API: " + e.getMessage());
            return buildFallbackResponse(userInput);
        }
    }

    private String buildPrompt(String userInput, String userContext, String language) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("SYSTEM INSTRUCTION: You are a local travel guide who lives in the destination city. ");
        prompt.append("You give honest, practical, and friendly advice like a local helping a friend plan a trip. ");
        prompt.append("Avoid generic travel blog language. Focus on real experiences, local preferences, and smart tips.\n");
        prompt.append("Style: natural, face-to-face tone; include local tips (best times, crowd avoidance, money-saving); ");
        prompt.append("suggest food, areas, and experiences locals actually prefer; warn about common tourist mistakes or overrated spots; ");
        prompt.append("use phrases like \"locals usually\", \"people here prefer\", \"if you ask someone from here\". ");
        prompt.append("Do not add booking links, prices, or map data.\n");
        prompt.append("Understand the user's travel intent and onboarding profile, then return a strictly formatted JSON object.\n");
        prompt.append("Respond in ").append(language != null ? language : "English").append(".\n");
        prompt.append("JSON schema: {\n")
                .append("  \"trip_overview\": string,\n")
                .append("  \"suggested_duration\": string,\n")
                .append("  \"budget_range\": string (range, no itemized prices),\n")
                .append("  \"itinerary_outline\": string or array of strings,\n")
                .append("  \"recommendations\": string or array of strings\n")
                .append("}\n");
        prompt.append("Each field should be concise, conversational, and clearly structured for rendering.\n");
        prompt.append("User input: ").append(userInput).append("\n\n");
        if (userContext != null && !userContext.isBlank()) {
            prompt.append("Onboarding profile: \n").append(userContext).append("\n\n");
        }
        prompt.append("Ensure the response feels like guidance from a local person while staying within the schema.");
        return prompt.toString();
    }

    private TripIntentResponse parseStructuredResponse(String textPayload, String userInput) {
        String cleaned = textPayload
                .replace("```json", "")
                .replace("```", "")
                .trim();

        JsonObject payload;
        try {
            payload = gson.fromJson(cleaned, JsonObject.class);
        } catch (Exception e) {
            return buildFallbackResponse(userInput);
        }

        String overview = safeString(payload, "trip_overview");
        String duration = safeString(payload, "suggested_duration");
        String budget = safeString(payload, "budget_range");
        String itinerary = normalizeArrayOrString(payload.get("itinerary_outline"));
        String recommendations = normalizeArrayOrString(payload.get("recommendations"));

        String suggestion = buildFormattedSuggestion(overview, duration, budget, itinerary, recommendations);

        return new TripIntentResponse(
                suggestion,
                "Trip suggestion generated successfully",
                overview,
                duration,
                budget,
                itinerary,
                recommendations
        );
    }

    private String extractTextPayload(JsonObject jsonResponse) {
        try {
            return jsonResponse.getAsJsonArray("candidates")
                    .get(0).getAsJsonObject()
                    .getAsJsonObject("content")
                    .getAsJsonArray("parts")
                    .get(0).getAsJsonObject()
                    .get("text").getAsString();
        } catch (Exception e) {
            return null;
        }
    }

    private String normalizeArrayOrString(JsonElement element) {
        if (element == null || element.isJsonNull()) return "";
        if (element.isJsonArray()) {
            return StreamSupport.stream(element.getAsJsonArray().spliterator(), false)
                    .map(JsonElement::getAsString)
                    .collect(Collectors.joining("\n- ", "- ", ""))
                    .trim();
        }
        return element.getAsString();
    }

    private String safeString(JsonObject obj, String key) {
        JsonElement el = obj.get(key);
        return (el != null && !el.isJsonNull()) ? el.getAsString() : "";
    }

    private String buildFormattedSuggestion(String overview,
                                           String duration,
                                           String budget,
                                           String itinerary,
                                           String recommendations) {
        StringBuilder sb = new StringBuilder();
        if (!overview.isBlank()) {
            sb.append("Trip Overview:\n").append(overview).append("\n\n");
        }
        if (!duration.isBlank()) {
            sb.append("Suggested Duration:\n").append(duration).append("\n\n");
        }
        if (!budget.isBlank()) {
            sb.append("Estimated Budget Range:\n").append(budget).append("\n\n");
        }
        if (!itinerary.isBlank()) {
            sb.append("Itinerary Outline:\n").append(itinerary).append("\n\n");
        }
        if (!recommendations.isBlank()) {
            sb.append("Recommendations:\n").append(recommendations).append("\n\n");
        }
        if (sb.length() == 0) {
            sb.append("Here is your personalized travel suggestion.\n\n").append(overview);
        }
        return sb.toString().trim();
    }

    private TripIntentResponse buildFallbackResponse(String userInput) {
        String fallback = "Thanks for sharing your travel idea! Our AI needs configuration. " +
                "Here's a quick starting point based on your request: \n\n" +
                "Trip Overview:\n" + userInput + "\n\n" +
                "Suggested Duration:\nWeekend to short escape (2-4 days)\n\n" +
                "Estimated Budget Range:\nSet aside a flexible budget for travel, stays, food, and local transport.\n\n" +
                "Itinerary Outline:\n- Day 1: Arrive, settle in, explore key sights\n- Day 2: Local experiences and food\n- Day 3+: Optional day trips or relaxation\n\n" +
                "Recommendations:\n- Check weather and peak hours for attractions\n- Pre-book stays/transport where possible\n- Keep some buffer for spontaneous plans";

        return new TripIntentResponse(
                fallback,
                "AI fallback suggestion (Gemini not configured)",
                "Based on your request: " + userInput,
                "2-4 days (adjust as needed)",
                "Flexible budget depending on travel mode and stays",
                "Day 1: Arrive and explore core areas\nDay 2: Local food and experiences\nDay 3+: Optional day trips or relaxation",
                "Prioritize must-see spots, local cuisine, and buffer time for discovery"
        );
    }
}
