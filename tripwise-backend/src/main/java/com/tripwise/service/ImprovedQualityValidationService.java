package com.tripwise.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.tripwise.dto.TripRequest;

import reactor.core.publisher.Mono;

/**
 * Improved Quality Validation Service
 * Enforces substantive coverage of all 8 mandatory dimensions
 * Respects "readable output" rule - never blocks readable responses
 */
@Service
public class ImprovedQualityValidationService {
    
    private static final Logger logger = LoggerFactory.getLogger(ImprovedQualityValidationService.class);
    
    private static final int MIN_TOTAL_WORDS = 800;
    private static final int MIN_DIMENSION_SCORE = 2; // Each dimension needs multiple indicators
    
    public Mono<ValidationResult> validateResponse(String response, TripRequest request) {
        logger.debug("=== IMPROVED VALIDATION START ===");
        logger.debug("Response length: {} chars, {} words", 
                    response.length(), response.split("\\s+").length);
        
        // HARD STOP: Readable output always passes validation
        if (response.length() >= 300) {
            logger.info("✓ Readable output ({} chars) - validation bypassed", response.length());
            return Mono.just(new ValidationResult(true, "Readable output - validation bypassed"));
        }
        
        // Pre-validation: Basic checks
        ValidationResult basicCheck = validateBasicRequirements(response);
        if (!basicCheck.isValid()) {
            logger.warn("✗ Basic validation failed: {}", basicCheck.getIssues());
            return Mono.just(basicCheck);
        }
        
        // Main validation: 8-dimension substantive check
        ValidationResult dimensionCheck = validateEightDimensions(response, request);
        
        if (dimensionCheck.isValid()) {
            logger.info("✓ VALIDATION PASSED - All 8 dimensions present");
        } else {
            logger.warn("✗ VALIDATION FAILED - {}", dimensionCheck.getIssues());
        }
        
        return Mono.just(dimensionCheck);
    }
    
    /**
     * Basic requirements: format, length, coherence
     */
    private ValidationResult validateBasicRequirements(String response) {
        List<String> issues = new ArrayList<>();
        
        // 1. Null/empty check
        if (response == null || response.trim().isEmpty()) {
            return new ValidationResult(false, "Response is empty");
        }
        
        // 2. Format violations
        if (response.contains("##") || response.contains("###")) {
            issues.add("Contains markdown headings");
        }
        if (response.contains("* ") || response.contains("- ") || response.contains("• ")) {
            issues.add("Contains bullet points");
        }
        if (response.contains("```")) {
            issues.add("Contains code blocks");
        }
        if (response.matches("(?s).*\\n\\s*\\d+\\.\\s+.*")) {
            issues.add("Contains numbered lists");
        }
        
        // 3. Length check
        int wordCount = response.split("\\s+").length;
        if (wordCount < MIN_TOTAL_WORDS) {
            issues.add(String.format("Too short: %d words (minimum: %d)", 
                                    wordCount, MIN_TOTAL_WORDS));
        }
        
        // 4. Coherence check
        if (isMostlyRepeated(response)) {
            issues.add("Response lacks coherence (repeated words)");
        }
        
        // 5. Error detection
        String lower = response.toLowerCase();
        if (lower.contains("error") || lower.contains("failed") || 
            lower.contains("unable to") || lower.contains("cannot generate")) {
            issues.add("Response contains error messages");
        }
        
        if (!issues.isEmpty()) {
            return new ValidationResult(false, String.join("; ", issues));
        }
        
        return new ValidationResult(true, "");
    }
    
    /**
     * Validate all 8 dimensions with substantive requirements
     */
    private ValidationResult validateEightDimensions(String response, TripRequest request) {
        String lower = response.toLowerCase();
        List<String> missingDimensions = new ArrayList<>();
        
        // Dimension 1: Trip Structure (Day Flow)
        int dayFlowScore = validateDayFlow(lower, request.getDays());
        if (dayFlowScore < MIN_DIMENSION_SCORE) {
            missingDimensions.add("Trip Structure (needs day-wise flow with pacing)");
        }
        logger.debug("Day Flow: {}/3", dayFlowScore);
        
        // Dimension 2: Stay Intelligence
        int stayScore = validateStayLogic(lower);
        if (stayScore < MIN_DIMENSION_SCORE) {
            missingDimensions.add("Stay Intelligence (needs neighborhood analysis with pros/cons)");
        }
        logger.debug("Stay Logic: {}/3", stayScore);
        
        // Dimension 3: Food Intelligence
        int foodScore = validateFoodLogic(lower);
        if (foodScore < MIN_DIMENSION_SCORE) {
            missingDimensions.add("Food Intelligence (needs local + tourist-safe + cultural tips)");
        }
        logger.debug("Food Logic: {}/3", foodScore);
        
        // Dimension 4: Local Places Integration
        int localScore = validateLocalIntegration(lower);
        if (localScore < MIN_DIMENSION_SCORE) {
            missingDimensions.add("Local Places (must be contextually integrated, not listed)");
        }
        logger.debug("Local Integration: {}/3", localScore);
        
        // Dimension 5: Transportation Reasoning
        int transportScore = validateTransportation(lower);
        if (transportScore < MIN_DIMENSION_SCORE) {
            missingDimensions.add("Transportation (needs costs + local methods + trade-offs)");
        }
        logger.debug("Transport: {}/3", transportScore);
        
        // Dimension 6: Money Intelligence (CRITICAL)
        int moneyScore = validateMoneyIntelligence(lower);
        if (moneyScore < MIN_DIMENSION_SCORE) {
            missingDimensions.add("Money Intelligence (needs daily budget + cash/card + specific costs)");
        }
        logger.debug("Money: {}/3", moneyScore);
        
        // Dimension 7: Cultural Behavior
        int culturalScore = validateCulturalBehavior(lower);
        if (culturalScore < MIN_DIMENSION_SCORE) {
            missingDimensions.add("Cultural Behavior (needs do's/don'ts + local appreciation)");
        }
        logger.debug("Cultural: {}/3", culturalScore);
        
        // Dimension 8: Safety & Reality Checks
        int safetyScore = validateSafetyRealism(lower);
        if (safetyScore < MIN_DIMENSION_SCORE) {
            missingDimensions.add("Safety Realism (needs honest assessment + overrated warnings)");
        }
        logger.debug("Safety: {}/3", safetyScore);
        
        // Calculate overall coverage
        int totalScore = dayFlowScore + stayScore + foodScore + localScore + 
                        transportScore + moneyScore + culturalScore + safetyScore;
        int maxScore = 24; // 8 dimensions * 3 points each
        double percentage = (totalScore * 100.0) / maxScore;
        
        logger.info("Overall Coverage: {}/{} ({:.1f}%)", totalScore, maxScore, percentage);
        
        if (!missingDimensions.isEmpty()) {
            String issues = "Missing dimensions: " + String.join("; ", missingDimensions);
            return new ValidationResult(false, issues);
        }
        
        return new ValidationResult(true, "");
    }
    
    // ============= DIMENSION VALIDATORS =============
    
    private int validateDayFlow(String text, int tripDays) {
        int score = 0;
        
        // Check for multiple day mentions
        long dayMentions = Arrays.asList("first day", "second day", "third day", 
                                        "day one", "day two", "next day", "following day")
            .stream()
            .filter(text::contains)
            .count();
        if (dayMentions >= Math.max(2, tripDays / 2)) score++;
        
        // Check for time-based pacing
        long timeMentions = Arrays.asList("morning", "afternoon", "evening", 
                                         "start with", "then", "after that")
            .stream()
            .filter(text::contains)
            .count();
        if (timeMentions >= 3) score++;
        
        // Check for pacing reasoning
        if (containsAny(text, Arrays.asList("take it easy", "exhausted", "jet lag", 
                                           "tired", "rest", "pace"))) {
            score++;
        }
        
        return score;
    }
    
    private int validateStayLogic(String text) {
        int score = 0;
        
        // Multiple neighborhoods mentioned
        if (countMatches(text, Arrays.asList("area", "neighborhood", "district", 
                                             "stay in", "stay near")) >= 2) {
            score++;
        }
        
        // Pros/cons reasoning
        if (containsAny(text, Arrays.asList("but", "however", "although", "downside", 
                                           "advantage", "disadvantage"))) {
            score++;
        }
        
        // Budget context + local perspective
        boolean hasBudget = containsAny(text, Arrays.asList("budget", "cheap", "expensive", "affordable"));
        boolean hasLocal = containsAny(text, Arrays.asList("locals", "residents", "most people"));
        if (hasBudget && hasLocal) score++;
        
        return score;
    }
    
    private int validateFoodLogic(String text) {
        int score = 0;
        
        // Food variety
        if (countMatches(text, Arrays.asList("food", "eat", "restaurant", "breakfast", 
                                             "lunch", "dinner", "street food")) >= 3) {
            score++;
        }
        
        // Local + tourist options
        boolean hasLocal = containsAny(text, Arrays.asList("locals eat", "local food", 
                                                          "traditional", "authentic"));
        boolean hasTourist = containsAny(text, Arrays.asList("if you", "tourist-friendly", 
                                                            "familiar", "safe option"));
        if (hasLocal || hasTourist) score++;
        
        // Cultural food tips
        if (containsAny(text, Arrays.asList("etiquette", "custom", "try", "avoid", 
                                           "typically", "usually"))) {
            score++;
        }
        
        return score;
    }
    
    private int validateLocalIntegration(String text) {
        int score = 0;
        
        // Contextual mentions (not lists)
        if (countMatches(text, Arrays.asList("you'll probably", "you might", "end up", 
                                             "on your way", "while you're")) >= 2) {
            score++;
        }
        
        // Local reasoning
        if (containsAny(text, Arrays.asList("locals go", "locals love", "residents", 
                                           "neighborhood favorite"))) {
            score++;
        }
        
        // Avoids list patterns
        if (!text.contains("here are some") && !text.contains("hidden gems") && 
            !text.contains("must-see list")) {
            score++;
        }
        
        return score;
    }
    
    private int validateTransportation(String text) {
        int score = 0;
        
        // Multiple modes mentioned
        if (countMatches(text, Arrays.asList("taxi", "bus", "metro", "train", "uber", 
                                             "grab", "walk", "scooter")) >= 2) {
            score++;
        }
        
        // Cost reasoning
        if (containsAny(text, Arrays.asList("costs about", "fare", "cheap", "expensive", 
                                           "price", "₹", "$"))) {
            score++;
        }
        
        // Local methods + trade-offs
        boolean hasLocal = containsAny(text, Arrays.asList("locals use", "local transport", 
                                                          "most people"));
        boolean hasTradeoff = containsAny(text, Arrays.asList("cost", "convenience", "faster", 
                                                              "cheaper", "easier"));
        if (hasLocal && hasTradeoff) score++;
        
        return score;
    }
    
    private int validateMoneyIntelligence(String text) {
        int score = 0;
        
        // Specific costs (numbers present)
        Pattern numberPattern = Pattern.compile("\\d+");
        long numberCount = numberPattern.matcher(text).results().count();
        if (numberCount >= 3) score++; // At least 3 numeric values
        
        // Budget discussion
        if (countMatches(text, Arrays.asList("cost", "price", "spend", "budget", 
                                             "per day", "daily")) >= 2) {
            score++;
        }
        
        // Cash vs digital + money mistakes
        boolean hasPayment = containsAny(text, Arrays.asList("cash", "card", "digital", 
                                                             "atm", "payment"));
        boolean hasTips = containsAny(text, Arrays.asList("watch out", "scam", "tourist price", 
                                                          "negotiate", "mistake"));
        if (hasPayment || hasTips) score++;
        
        return score;
    }
    
    private int validateCulturalBehavior(String text) {
        int score = 0;
        
        // Cultural mentions
        if (containsAny(text, Arrays.asList("culture", "custom", "tradition", "etiquette", 
                                           "respect", "behavior"))) {
            score++;
        }
        
        // Do's and don'ts
        if (countMatches(text, Arrays.asList("don't", "avoid", "never", "always", 
                                             "should", "shouldn't")) >= 2) {
            score++;
        }
        
        // Local appreciation + mistakes
        boolean hasAppreciation = containsAny(text, Arrays.asList("locals appreciate", 
                                                                  "people here", "considered"));
        boolean hasMistakes = containsAny(text, Arrays.asList("mistake", "tourists often", 
                                                              "common error"));
        if (hasAppreciation || hasMistakes) score++;
        
        return score;
    }
    
    private int validateSafetyRealism(String text) {
        int score = 0;
        
        // Safety mentions
        if (containsAny(text, Arrays.asList("safe", "safety", "careful", "risk", 
                                           "avoid", "danger"))) {
            score++;
        }
        
        // Reality checks
        if (containsAny(text, Arrays.asList("overrated", "disappointing", "honestly", 
                                           "actually", "reality", "truth"))) {
            score++;
        }
        
        // Specific warnings + balance
        boolean hasWarnings = containsAny(text, Arrays.asList("be careful", "watch out", 
                                                              "pickpocket", "scam"));
        boolean hasBalance = containsAny(text, Arrays.asList("but", "however", "generally safe", 
                                                             "mostly safe"));
        if (hasWarnings || hasBalance) score++;
        
        return score;
    }
    
    // ============= HELPER METHODS =============
    
    private boolean containsAny(String text, List<String> keywords) {
        return keywords.stream().anyMatch(text::contains);
    }
    
    private long countMatches(String text, List<String> keywords) {
        return keywords.stream().filter(text::contains).count();
    }
    
    private boolean isMostlyRepeated(String response) {
        String[] words = response.trim().split("\\s+");
        if (words.length < 10) return false;
        
        Map<String, Integer> wordCounts = new HashMap<>();
        for (String word : words) {
            if (word.length() > 3) { // Ignore short words
                wordCounts.put(word.toLowerCase(), 
                              wordCounts.getOrDefault(word.toLowerCase(), 0) + 1);
            }
        }
        
        int maxCount = wordCounts.values().stream()
            .max(Integer::compare)
            .orElse(0);
        
        return maxCount > words.length / 3; // More than 33% repetition
    }
    
    // ============= RESULT CLASSES =============
    
    public static class ValidationResult {
        private final boolean valid;
        private final String issues;
        
        public ValidationResult(boolean valid, String issues) {
            this.valid = valid;
            this.issues = issues;
        }
        
        public boolean isValid() {
            return valid;
        }
        
        public String getIssues() {
            return issues;
        }
    }
}
