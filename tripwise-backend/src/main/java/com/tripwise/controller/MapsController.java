package com.tripwise.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.Map;

@RestController
@RequestMapping("/api/maps")
@RequiredArgsConstructor
@Slf4j
public class MapsController {

    private final WebClient webClient;

    @GetMapping("/geocode")
    public Mono<ResponseEntity<Map<String, Object>>> geocode(@RequestParam String q) {
        if (q == null || q.isBlank()) {
            return Mono.just(ResponseEntity.badRequest().build());
        }

        String url = "https://nominatim.openstreetmap.org/search"
                + "?q=" + java.net.URLEncoder.encode(q, java.nio.charset.StandardCharsets.UTF_8)
                + "&format=json&limit=1&addressdetails=0";

        return webClient.get()
                .uri(url)
                .header("User-Agent", "TripWise/1.0 (tripwise.app)")
                .retrieve()
                .bodyToMono(com.fasterxml.jackson.databind.JsonNode.class)
                .map(json -> {
                    if (json.isArray() && json.size() > 0) {
                        com.fasterxml.jackson.databind.JsonNode first = json.get(0);
                        double lat = first.at("/lat").asDouble();
                        double lng = first.at("/lon").asDouble();
                        return ResponseEntity.ok(Map.<String, Object>of("lat", lat, "lng", lng, "display", first.at("/display_name").asText("")));
                    }
                    return ResponseEntity.ok(Map.<String, Object>of("lat", 0.0, "lng", 0.0));
                })
                .onErrorResume(e -> {
                    log.warn("Geocoding failed for '{}': {}", q, e.getMessage());
                    return Mono.just(ResponseEntity.ok(Map.of("lat", 0.0, "lng", 0.0)));
                });
    }
}
