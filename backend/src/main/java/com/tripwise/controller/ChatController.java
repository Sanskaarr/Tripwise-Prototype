package com.tripwise.controller;

import com.tripwise.dto.ChatRequest;
import com.tripwise.model.User;
import com.tripwise.repository.UserRepository;
import com.tripwise.service.OpenAIService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final OpenAIService openAIService;
    private final UserRepository userRepository;

    public ChatController(OpenAIService openAIService, UserRepository userRepository) {
        this.openAIService = openAIService;
        this.userRepository = userRepository;
    }

    @PostMapping
    public ResponseEntity<?> chat(@RequestAttribute("userId") String userId,
                                   @RequestBody ChatRequest request) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new Exception("User not found"));

            String language = request.getLanguage() != null ? request.getLanguage() : 
                             user.getPreferredLanguage() != null ? user.getPreferredLanguage() : "English";

            String enhancedPrompt = String.format(
                "User preferences: Travel style: %s, Dietary: %s, Interests: %s. Question: %s",
                user.getTravelStyle(), user.getDietaryPreferences(), user.getInterests(), request.getText()
            );

            String response = openAIService.getChatResponse(enhancedPrompt, language);

            Map<String, Object> result = new HashMap<>();
            result.put("response", response);
            result.put("language", language);

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}