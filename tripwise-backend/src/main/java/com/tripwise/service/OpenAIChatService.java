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
public class OpenAIChatService {

    private final RestTemplate restTemplate;
    private final Gson gson = new Gson();

    @Value("${openai.api.url:https://api.openai.com/v1/chat/completions}")
    private String openaiApiUrl;

    @Value("${openai.model:gpt-4o-mini}")
    private String defaultModel;

    public OpenAIChatService(@Qualifier("openaiRestTemplate") RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public String chat(List<ChatMessage> messages) {
        return chat(messages, defaultModel, 0.7, 1000);
    }

    public String chat(List<ChatMessage> messages, String model, Double temperature, Integer maxTokens) {
        JsonObject requestBody = new JsonObject();
        requestBody.addProperty("model", model);
        
        JsonArray messagesArray = new JsonArray();
        for (ChatMessage msg : messages) {
            JsonObject messageObj = new JsonObject();
            messageObj.addProperty("role", msg.getRole());
            messageObj.addProperty("content", msg.getContent());
            messagesArray.add(messageObj);
        }
        requestBody.add("messages", messagesArray);
        requestBody.addProperty("temperature", temperature);
        requestBody.addProperty("max_tokens", maxTokens);

        String requestJson = gson.toJson(requestBody);
        
        String responseJson = restTemplate.postForObject(openaiApiUrl, requestJson, String.class);
        JsonObject responseObj = gson.fromJson(responseJson, JsonObject.class);
        
        return responseObj.getAsJsonArray("choices")
                .get(0).getAsJsonObject()
                .getAsJsonObject("message")
                .get("content").getAsString();
    }

    public String chatWithContext(String userMessage, String systemPrompt) {
        List<ChatMessage> messages = List.of(
                new ChatMessage("system", systemPrompt),
                new ChatMessage("user", userMessage)
        );
        return chat(messages);
    }
}
