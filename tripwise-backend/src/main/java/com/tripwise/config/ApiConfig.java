package com.tripwise.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ApiConfig {
    
    @Value("${openai.api.key:}")
    private String openaiApiKey;
    
    @Value("${perplexity.api.key:}")
    private String perplexityApiKey;
    
    public String getOpenaiApiKey() {
        if (openaiApiKey == null || openaiApiKey.trim().isEmpty()) {
            throw new IllegalStateException("OpenAI API key not configured. Please set OPENAI_API_KEY environment variable.");
        }
        return openaiApiKey.trim();
    }
    
    public String getPerplexityApiKey() {
        if (perplexityApiKey == null || perplexityApiKey.trim().isEmpty()) {
            throw new IllegalStateException("Perplexity API key not configured. Please set PERPLEXITY_API_KEY environment variable.");
        }
        return perplexityApiKey.trim();
    }
}
