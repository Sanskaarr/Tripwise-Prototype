package com.tripwise.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {
    
    @Autowired
    private ApiConfig apiConfig;
    
    @Bean
    public WebClient webClient() {
        return WebClient.builder()
                .codecs(configurer -> configurer.defaultCodecs())
                .build();
    }
    
    // @Bean("openaiWebClient")
    // public WebClient openaiWebClient() {
    //     return WebClient.builder()
    //             .baseUrl("https://api.openai.com/v1/chat/completions")
    //             .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + apiConfig.getOpenaiApiKey())
    //             .defaultHeader(HttpHeaders.CONTENT_TYPE, "application/json")
    //             .codecs(configurer -> configurer.defaultCodecs())
    //             .build();
    // }
    
    // @Bean("perplexityWebClient")
    // public WebClient perplexityWebClient() {
    //     return WebClient.builder()
    //             .baseUrl("https://api.perplexity.ai/chat/completions")
    //             .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + apiConfig.getPerplexityApiKey())
    //             .defaultHeader(HttpHeaders.CONTENT_TYPE, "application/json")
    //             .codecs(configurer -> configurer.defaultCodecs())
    //             .build();
    // }
}
