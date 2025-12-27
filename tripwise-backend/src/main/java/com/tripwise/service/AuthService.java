package com.tripwise.service;

import com.tripwise.dto.*;
import com.tripwise.dto.OnboardingRequest;
import com.tripwise.model.User;
import com.tripwise.repository.UserRepository;
import com.tripwise.security.JwtUtil;
import com.tripwise.util.PhoneNumberUtil;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public AuthResponse login(LoginRequest request) {
        System.out.println("=== LOGIN REQUEST RECEIVED ===");
        System.out.println("Raw phone number: " + request.getPhoneNumber());
        
        if (request.getPhoneNumber() == null || request.getPhoneNumber().isEmpty()) {
            return new AuthResponse(null, null, false, "Phone number is required", null);
        }
        
        String normalizedPhone = PhoneNumberUtil.normalizePhoneNumber(request.getPhoneNumber());
        System.out.println("Normalized phone: " + normalizedPhone);
        
        User user = userRepository.findByPhoneNumber(normalizedPhone).orElse(null);
        
        if (user == null) {
            try {
                User newUser = new User();
                newUser.setPhoneNumber(normalizedPhone);
                newUser.setPassword(passwordEncoder.encode("default"));
                newUser.setIsFirstTime(true);
                newUser.setLastLoginAt(LocalDateTime.now());
                user = userRepository.save(newUser);
                
                UserDetailsDTO userDetails = new UserDetailsDTO(
                    null,
                    user.getPhoneNumber(),
                    null, null, null, null, null
                );
                
                return new AuthResponse(null, user.getId(), true, 
                    "Welcome to TripWise! Please complete your profile.", userDetails);
            } catch (DuplicateKeyException e) {
                user = userRepository.findByPhoneNumber(normalizedPhone).orElse(null);
                if (user == null) {
                    return new AuthResponse(null, null, false, "Unable to create or find user", null);
                }
            }
        }

        user.setLastLoginAt(LocalDateTime.now());
        
          boolean isFirstTime = Boolean.TRUE.equals(user.getIsFirstTime());
          String displayName = user.getEmail() != null ? user.getEmail() : user.getPhoneNumber();
          String message;
          
            if (isFirstTime) {
                message = String.format("Welcome to TripWise, %s! Let's get started.", displayName);
            } else {
                message = String.format("Welcome back, %s! Ready to plan your next trip?", displayName);
            }
 
        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail() != null ? user.getEmail() : user.getPhoneNumber(), user.getId());

        UserDetailsDTO userDetails = new UserDetailsDTO(
            user.getEmail(),
            user.getPhoneNumber(),
            user.getPreferredLanguage(),
            user.getBudgetRange(),
            user.getTravelStyle(),
            user.getDietaryPreferences(),
            user.getInterests()
        );

        return new AuthResponse(token, user.getId(), isFirstTime, message, userDetails);
    }

    public AuthResponse register(RegisterRequest request) throws Exception {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new Exception("Email already exists");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhoneNumber(request.getPhoneNumber());
        user.setPreferredLanguage(request.getPreferredLanguage());
        user.setTravelStyle(request.getTravelStyle());
        user.setDietaryPreferences(request.getDietaryPreferences());
        user.setInterests(request.getInterests());
        user.setIsFirstTime(false);
        user.setLastLoginAt(LocalDateTime.now());

        user = userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail(), user.getId());

        UserDetailsDTO userDetails = new UserDetailsDTO(
            user.getEmail(),
            user.getPhoneNumber(),
            user.getPreferredLanguage(),
            user.getBudgetRange(),
            user.getTravelStyle(),
            user.getDietaryPreferences(),
            user.getInterests()
        );

        return new AuthResponse(token, user.getId(), false, 
            "Account created successfully! Let's start exploring.", userDetails);
    }

    public AuthResponse completeOnboarding(OnboardingRequest request) throws Exception {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new Exception("User not found"));

        user.setPreferredLanguage(request.getPreferredLanguage());
        user.setTravelStyle(request.getTravelStyle());
        user.setDietaryPreferences(request.getDietaryPreferences());
        user.setInterests(request.getInterests());
        user.setIsFirstTime(false);

        userRepository.save(user);

        UserDetailsDTO userDetails = new UserDetailsDTO(
                user.getEmail(),
                user.getPhoneNumber(),
                user.getPreferredLanguage(),
                user.getBudgetRange(),
                user.getTravelStyle(),
                user.getDietaryPreferences(),
                user.getInterests()
        );

        return new AuthResponse(null, user.getId(), false,
                "Onboarding completed successfully.", userDetails);
    }
}