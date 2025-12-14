package com.tripwise.controller;

import com.google.gson.JsonObject;
import com.tripwise.dto.LocalGuideRequest;
import com.tripwise.model.User;
import com.tripwise.repository.UserRepository;
import com.tripwise.service.GeminiService;
import com.tripwise.service.GoogleMapsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/local-guide")
public class LocalGuideController {

    private final GeminiService geminiService;
    private final GoogleMapsService googleMapsService;
    private final UserRepository userRepository;

    public LocalGuideController(GeminiService geminiService, GoogleMapsService googleMapsService, 
                                UserRepository userRepository) {
        this.geminiService = geminiService;
        this.googleMapsService = googleMapsService;
        this.userRepository = userRepository;
    }

    @PostMapping
    public ResponseEntity<?> getLocalGuide(@RequestAttribute("userId") String userId,
                                            @RequestBody LocalGuideRequest request) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new Exception("User not found"));

            String language = request.getLanguage() != null ? request.getLanguage() : 
                             user.getPreferredLanguage() != null ? user.getPreferredLanguage() : "English";

            String aiGuide = geminiService.generateLocalGuide(request.getLocation(), language);
            List<JsonObject> places = googleMapsService.searchPlaces(request.getLocation(), "tourist_attraction");

            Map<String, Object> result = new HashMap<>();
            result.put("aiGuide", aiGuide);
            result.put("places", places);
            result.put("location", request.getLocation());
            result.put("language", language);

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/places")
    public ResponseEntity<?> searchPlaces(@RequestParam String location, 
                                           @RequestParam(required = false) String type) {
        try {
            String placeType = type != null ? type : "tourist_attraction";
            List<JsonObject> places = googleMapsService.searchPlaces(location, placeType);
            return ResponseEntity.ok(places);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}