package com.tripwise.controller;

import com.tripwise.dto.AuthResponse;
import com.tripwise.dto.LoginRequest;
import com.tripwise.dto.RegisterRequest;
import com.tripwise.dto.OnboardingRequest;
import com.tripwise.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            AuthResponse response = authService.register(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/onboarding")
    public ResponseEntity<AuthResponse> completeOnboarding(@RequestBody OnboardingRequest request) {
        try {
            AuthResponse response = authService.completeOnboarding(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
