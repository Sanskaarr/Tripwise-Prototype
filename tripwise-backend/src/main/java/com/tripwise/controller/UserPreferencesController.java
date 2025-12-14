package com.tripwise.controller;

import com.tripwise.service.UserPreferencesService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserPreferencesController {

    private final UserPreferencesService userPreferencesService;

    public UserPreferencesController(UserPreferencesService userPreferencesService) {
        this.userPreferencesService = userPreferencesService;
    }

    @GetMapping("/{userId}/preferences")
    public ResponseEntity<Map<String, Object>> getUserPreferences(@PathVariable String userId) {
        try {
            Map<String, Object> preferences = userPreferencesService.getUserPreferences(userId);
            return ResponseEntity.ok(preferences);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PutMapping("/{userId}/preferences")
    public ResponseEntity<Map<String, Object>> updateUserPreferences(
            @PathVariable String userId, 
            @RequestBody Map<String, Object> preferences) {
        try {
            userPreferencesService.updateUserPreferences(userId, preferences);
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "Preferences updated successfully");
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/{userId}/session")
    public ResponseEntity<Map<String, Object>> createSession(@PathVariable String userId) {
        try {
            userPreferencesService.createSessionContext(userId);
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "Session created successfully");
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/{userId}/session")
    public ResponseEntity<Map<String, Object>> getSession(@PathVariable String userId) {
        Map<String, Object> session = userPreferencesService.getSessionContext(userId);
        return ResponseEntity.ok(session);
    }

    @DeleteMapping("/{userId}/session")
    public ResponseEntity<Map<String, Object>> clearSession(@PathVariable String userId) {
        userPreferencesService.clearSessionContext(userId);
        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("message", "Session cleared successfully");
        return ResponseEntity.ok(result);
    }
}
