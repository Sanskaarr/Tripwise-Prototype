package com.tripwise.controller;

import com.tripwise.model.TravelerProfile;
import com.tripwise.security.JwtUtil;
import com.tripwise.service.ProfileService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final ProfileService profileService;
    private final JwtUtil jwtUtil;

    public AuthController(ProfileService profileService, JwtUtil jwtUtil) {
        this.profileService = profileService;
        this.jwtUtil = jwtUtil;
    }

    /**
     * Login with phone/email.
     * Generates a JWT token for the session.
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        String identifier = request.get("identifier");

        if (identifier == null || identifier.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "error", "Identifier is required"));
        }

        identifier = identifier.trim();
        log.info("Login attempt for: {}", identifier);

        // Generate token for this user (whether new or existing)
        // We use the identifier as the subject
        String token = jwtUtil.generateToken(identifier);

        // Check if profile exists
        TravelerProfile profile = profileService.findByIdentifier(identifier);

        if (profile != null) {
            // Existing user
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "token", token,
                    "exists", true,
                    "profile", profile));
        } else {
            // New user - they have a valid session token but no profile yet
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "token", token,
                    "exists", false,
                    "isNewUser", true));
        }
    }

    /**
     * Validate session token and return fresh profile data.
     */
    @GetMapping("/validate")
    public ResponseEntity<?> validateSession(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body(Map.of("error", "Missing or invalid token"));
        }

        String token = authHeader.substring(7); // Remove "Bearer "

        try {
            // Validate token structure and expiration
            if (!jwtUtil.validateToken(token)) {
                return ResponseEntity.status(401).body(Map.of("error", "Invalid or expired token"));
            }

            // Extract user ID (phone/email) from token
            String identifier = jwtUtil.extractUserId(token);

            log.info("Validating session for: {}", identifier);

            // Fetch latest profile
            TravelerProfile profile = profileService.findByIdentifier(identifier);

            if (profile != null) {
                return ResponseEntity.ok(Map.of(
                        "success", true,
                        "isValid", true,
                        "profile", profile));
            } else {
                // Valid token but no profile (user hasn't saved step 1 yet)
                return ResponseEntity.ok(Map.of(
                        "success", true,
                        "isValid", true,
                        "isNewUser", true,
                        "identifier", identifier));
            }

        } catch (Exception e) {
            log.error("Token validation error", e);
            return ResponseEntity.status(401).body(Map.of("error", "Session validation failed"));
        }
    }
}
