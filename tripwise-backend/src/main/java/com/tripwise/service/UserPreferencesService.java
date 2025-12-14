package com.tripwise.service;

import com.tripwise.model.User;
import com.tripwise.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class UserPreferencesService {

    private final UserRepository userRepository;
    private final Map<String, Map<String, Object>> sessionContext = new HashMap<>();

    public UserPreferencesService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Map<String, Object> getUserPreferences(String userId) throws Exception {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new Exception("User not found"));

        Map<String, Object> preferences = new HashMap<>();
        preferences.put("userId", user.getId());
        preferences.put("email", user.getEmail());
        preferences.put("phoneNumber", user.getPhoneNumber());
        preferences.put("preferredLanguage", user.getPreferredLanguage());
        preferences.put("budgetRange", user.getBudgetRange());
        preferences.put("travelStyle", user.getTravelStyle());
        preferences.put("dietaryPreferences", user.getDietaryPreferences());
        preferences.put("interests", user.getInterests());
        preferences.put("isFirstTime", user.getIsFirstTime());
        preferences.put("lastLoginAt", user.getLastLoginAt());
        
        return preferences;
    }

    public void updateUserPreferences(String userId, Map<String, Object> preferences) throws Exception {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new Exception("User not found"));

        if (preferences.containsKey("phoneNumber")) {
            user.setPhoneNumber((String) preferences.get("phoneNumber"));
        }
        if (preferences.containsKey("preferredLanguage")) {
            user.setPreferredLanguage((String) preferences.get("preferredLanguage"));
        }
        if (preferences.containsKey("budgetRange")) {
            user.setBudgetRange((String) preferences.get("budgetRange"));
        }
        if (preferences.containsKey("travelStyle")) {
            user.setTravelStyle((String) preferences.get("travelStyle"));
        }
        if (preferences.containsKey("dietaryPreferences")) {
            user.setDietaryPreferences((String) preferences.get("dietaryPreferences"));
        }
        if (preferences.containsKey("interests")) {
            user.setInterests((String) preferences.get("interests"));
        }

        userRepository.save(user);
    }

    public void createSessionContext(String userId) throws Exception {
        Map<String, Object> preferences = getUserPreferences(userId);
        Map<String, Object> context = new HashMap<>();
        context.put("preferences", preferences);
        context.put("sessionStartTime", LocalDateTime.now());
        context.put("conversationHistory", new java.util.ArrayList<>());
        
        sessionContext.put(userId, context);
    }

    public Map<String, Object> getSessionContext(String userId) {
        return sessionContext.getOrDefault(userId, new HashMap<>());
    }

    public void updateSessionContext(String userId, String key, Object value) {
        Map<String, Object> context = getSessionContext(userId);
        context.put(key, value);
        sessionContext.put(userId, context);
    }

    public void addToConversationHistory(String userId, String role, String message) {
        Map<String, Object> context = getSessionContext(userId);
        
        @SuppressWarnings("unchecked")
        java.util.List<Map<String, String>> history = 
            (java.util.List<Map<String, String>>) context.getOrDefault("conversationHistory", new java.util.ArrayList<>());
        
        Map<String, String> entry = new HashMap<>();
        entry.put("role", role);
        entry.put("message", message);
        entry.put("timestamp", LocalDateTime.now().toString());
        
        history.add(entry);
        context.put("conversationHistory", history);
        sessionContext.put(userId, context);
    }

    public void clearSessionContext(String userId) {
        sessionContext.remove(userId);
    }

    public boolean isFirstTimeUser(String userId) {
        try {
            User user = userRepository.findById(userId).orElse(null);
            return user != null && user.getIsFirstTime();
        } catch (Exception e) {
            return false;
        }
    }

    public void markUserAsReturning(String userId) throws Exception {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new Exception("User not found"));
        user.setIsFirstTime(false);
        userRepository.save(user);
    }
}
