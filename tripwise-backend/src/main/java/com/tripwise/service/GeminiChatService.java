package com.tripwise.service;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.tripwise.dto.ChatMessage;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
public class GeminiChatService {

    private final RestTemplate restTemplate;
    private final Gson gson = new Gson();

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    @Value("${gemini.api.url:https://generativelanguage.googleapis.com/v1beta/models}")
    private String geminiApiBaseUrl;

    @Value("${gemini.model:gemini-1.5-flash}")
    private String defaultModel;

    public GeminiChatService(@Qualifier("geminiRestTemplate") RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public String chat(List<ChatMessage> messages) {
        return chat(messages, defaultModel);
    }

    public String chat(List<ChatMessage> messages, String model) {
        String apiUrl = String.format("%s/%s:generateContent?key=%s", 
                geminiApiBaseUrl, model, geminiApiKey);

        JsonObject requestBody = new JsonObject();
        JsonArray contentsArray = new JsonArray();

        for (ChatMessage msg : messages) {
            JsonObject content = new JsonObject();
            JsonObject parts = new JsonObject();
            parts.addProperty("text", msg.getContent());
            
            JsonArray partsArray = new JsonArray();
            partsArray.add(parts);
            
            content.add("parts", partsArray);
            content.addProperty("role", mapRole(msg.getRole()));
            contentsArray.add(content);
        }

        requestBody.add("contents", contentsArray);

        String requestJson = gson.toJson(requestBody);
        
        String responseJson = restTemplate.postForObject(apiUrl, requestJson, String.class);
        JsonObject responseObj = gson.fromJson(responseJson, JsonObject.class);
        
        return responseObj.getAsJsonArray("candidates")
                .get(0).getAsJsonObject()
                .getAsJsonObject("content")
                .getAsJsonArray("parts")
                .get(0).getAsJsonObject()
                .get("text").getAsString();
    }

    public String chatWithContext(String userMessage, String systemPrompt) {
        List<ChatMessage> messages = List.of(
                new ChatMessage("system", systemPrompt),
                new ChatMessage("user", userMessage)
        );
        return chat(messages);
    }

    private String mapRole(String role) {
        if ("assistant".equals(role)) {
            return "model";
        }
        return "user";
    }
}
