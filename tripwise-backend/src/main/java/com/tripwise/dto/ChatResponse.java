package com.tripwise.dto;

public class ChatResponse {
    private String response;
    private String provider;
    private int tokensUsed;

    public ChatResponse() {}

    public ChatResponse(String response, String provider, int tokensUsed) {
        this.response = response;
        this.provider = provider;
        this.tokensUsed = tokensUsed;
    }

    public String getResponse() { return response; }
    public void setResponse(String response) { this.response = response; }
    public String getProvider() { return provider; }
    public void setProvider(String provider) { this.provider = provider; }
    public int getTokensUsed() { return tokensUsed; }
    public void setTokensUsed(int tokensUsed) { this.tokensUsed = tokensUsed; }
}
