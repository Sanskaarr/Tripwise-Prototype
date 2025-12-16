package com.tripwise.service;

import com.tripwise.dto.*;
import com.tripwise.model.User;
import com.tripwise.repository.UserRepository;
import com.tripwise.config.PasswordEncoderBean.SimplePasswordEncoder;
import com.tripwise.util.PhoneNumberUtil;
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

    public AuthResponse login(LoginRequest request) throws Exception {
        if (request.getPhoneNumber() == null || request.getPhoneNumber().isEmpty()) {
            throw new Exception("Phone number is required");
        }
        
        String normalizedPhone = PhoneNumberUtil.normalizePhoneNumber(request.getPhoneNumber());
        
        User user = userRepository.findByPhoneNumber(normalizedPhone).orElse(null);
        
        if (user == null) {
            User newUser = new User();
            newUser.setPhoneNumber(normalizedPhone);
            newUser.setPassword(passwordEncoder.encode("default"));
            newUser.setIsFirstTime(true);
            newUser.setLastLoginAt(LocalDateTime.now());
            user = userRepository.save(newUser);
            
            UserDetailsDTO userDetails = new UserDetailsDTO(
                null,
                newUser.getPhoneNumber(),
                null, null, null, null, null
            );
            
            return new AuthResponse(null, user.getId(), true, 
                "Welcome to TripWise! Please complete your profile.", userDetails);
        }

        user.setLastLoginAt(LocalDateTime.now());
        
        boolean isFirstTime = Boolean.TRUE.equals(user.getIsFirstTime());
        String message;
        
        if (isFirstTime) {
            message = "Welcome to TripWise! Please complete your profile.";
            user.setIsFirstTime(false);
        } else {
            message = String.format("Welcome back! Ready for your next adventure in %s?", 
                user.getPreferredLanguage() != null ? user.getPreferredLanguage() : "English");
        }
        
        userRepository.save(user);

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

    public void completeProfile(String userId, RegisterRequest request) throws Exception {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new Exception("User not found"));

        user.setPhoneNumber(request.getPhoneNumber());
        user.setPreferredLanguage(request.getPreferredLanguage());
        user.setTravelStyle(request.getTravelStyle());
        user.setDietaryPreferences(request.getDietaryPreferences());
        user.setInterests(request.getInterests());
        user.setIsFirstTime(false);

        userRepository.save(user);
    }
}