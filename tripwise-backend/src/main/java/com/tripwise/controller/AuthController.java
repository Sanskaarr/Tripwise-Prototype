package com.tripwise.controller;

import com.tripwise.model.TravelerProfile;
import com.tripwise.security.JwtUtil;
import com.tripwise.service.ProfileService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final ProfileService profileService;
    private final JwtUtil jwtUtil;

    @Value("${server.cookie.secure:false}")
    private boolean secureCookie;

    public AuthController(ProfileService profileService, JwtUtil jwtUtil) {
        this.profileService = profileService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request,
                                   HttpServletResponse response) {
        String identifier = request.get("identifier");
        if (identifier == null || identifier.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "error", "Identifier is required"));
        }
        identifier = identifier.trim();
        log.info("Login attempt for: {}", identifier);

        String token = jwtUtil.generateToken(identifier);
        setAuthCookie(response, token);

        TravelerProfile profile = profileService.findByIdentifier(identifier);
        if (profile != null) {
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "exists", true,
                    "token", token,
                    "profile", profile));
        }
        return ResponseEntity.ok(Map.of(
                "success", true,
                "exists", false,
                "isNewUser", true,
                "token", token));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        ResponseCookie clearCookie = ResponseCookie.from("auth_token", "")
                .httpOnly(true)
                .path("/")
                .maxAge(0)
                .sameSite("Lax")
                .secure(secureCookie)
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, clearCookie.toString());
        return ResponseEntity.ok(Map.of("message", "Logged out"));
    }

    @GetMapping("/validate")
    public ResponseEntity<?> validateSession(@AuthenticationPrincipal String identifier,
                                             HttpServletResponse response) {
        if (identifier == null) {
            return ResponseEntity.status(401).body(Map.of("error", "No valid session"));
        }
        log.info("Validating session for: {}", identifier);
        String token = jwtUtil.generateToken(identifier);
        setAuthCookie(response, token);
        TravelerProfile profile = profileService.findByIdentifier(identifier);
        if (profile != null) {
            return ResponseEntity.ok(Map.of("success", true, "isValid", true, "token", token, "profile", profile));
        }
        return ResponseEntity.ok(Map.of("success", true, "isValid", true, "token", token, "isNewUser", true, "identifier", identifier));
    }

    private void setAuthCookie(HttpServletResponse response, String token) {
        ResponseCookie cookie = ResponseCookie.from("auth_token", token)
                .httpOnly(true)
                .path("/")
                .maxAge(Duration.ofDays(7))
                .sameSite("Lax")
                .secure(secureCookie)
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }
}
