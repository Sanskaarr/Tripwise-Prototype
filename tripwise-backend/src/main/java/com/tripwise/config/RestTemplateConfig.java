package com.tripwise.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.web.client.RestTemplate;

@Configuration
public class RestTemplateConfig {

    @Value("${openai.api.key}")
    private String openaiApiKey;

    @Bean(name = "openaiRestTemplate")
    public RestTemplate openaiRestTemplate() {
        RestTemplate restTemplate = new RestTemplate();
        
        ClientHttpRequestInterceptor interceptor = (request, body, execution) -> {
            request.getHeaders().set(HttpHeaders.AUTHORIZATION, "Bearer " + openaiApiKey);
            request.getHeaders().set(HttpHeaders.CONTENT_TYPE, "application/json");
            return execution.execute(request, body);
        };
        
        restTemplate.getInterceptors().add(interceptor);
        return restTemplate;
    }

    @Bean(name = "geminiRestTemplate")
    public RestTemplate geminiRestTemplate() {
        RestTemplate restTemplate = new RestTemplate();
        
        ClientHttpRequestInterceptor interceptor = (request, body, execution) -> {
            request.getHeaders().set(HttpHeaders.CONTENT_TYPE, "application/json");
            return execution.execute(request, body);
        };
        
        restTemplate.getInterceptors().add(interceptor);
        return restTemplate;
    }

    @Bean(name = "googleMapsRestTemplate")
    public RestTemplate googleMapsRestTemplate() {
        return new RestTemplate();
    }
}