package com.tripwise.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ApiConfig {

    @Value("${gemini.api.key:}")
    private String geminiApiKey;

    public String getGeminiApiKey() {
        if (geminiApiKey == null || geminiApiKey.trim().isEmpty()) {
            return "";
        }
        return geminiApiKey.trim();
    }
}
