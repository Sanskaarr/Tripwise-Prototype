package com.tripwise.service;

import com.tripwise.model.TravelerProfile;
import com.tripwise.repository.TravelerProfileRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Slf4j
@Service
public class ProfileService {

    private final TravelerProfileRepository repository;

    public ProfileService(TravelerProfileRepository repository) {
        this.repository = repository;
    }

    /**
     * Create new profile
     */
    public TravelerProfile createProfile(String profileId) {
        log.info("Creating new profile: {}", profileId);

        TravelerProfile profile = TravelerProfile.builder()
                .profileId(profileId)
                .status("DRAFT")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        TravelerProfile saved = repository.save(profile);
        log.info("Profile created successfully: {}", saved.getProfileId());

        return saved;
    }

    /**
     * Get profile by profileId
     */
    public TravelerProfile getProfile(String profileId) {
        log.info("Fetching profile: {}", profileId);

        Optional<TravelerProfile> profile = repository.findByProfileId(profileId);

        if (profile.isEmpty()) {
            log.warn("Profile not found: {}", profileId);
            return null;
        }

        return profile.get();
    }

    /**
     * Update profile
     */
    public TravelerProfile updateProfile(TravelerProfile profile) {
        log.info("Updating profile: {}", profile.getProfileId());

        profile.setUpdatedAt(LocalDateTime.now());
        TravelerProfile saved = repository.save(profile);

        log.info("Profile updated successfully: {}", saved.getProfileId());
        return saved;
    }

    /**
     * Check if profile exists
     */
    public boolean profileExists(String profileId) {
        return repository.existsByProfileId(profileId);
    }

    /**
     * Find profile by identifier (phone or email)
     */
    public TravelerProfile findByIdentifier(String identifier) {
        log.info("Finding profile by identifier: {}", identifier);

        // Try to find by whatsapp number first
        Optional<TravelerProfile> profile = repository.findByBasicInfo_WhatsappNumber(identifier);

        if (profile.isPresent()) {
            log.info("Profile found by whatsapp number");
            return profile.get();
        }

        // Try to find by email
        profile = repository.findByBasicInfo_Email(identifier);

        if (profile.isPresent()) {
            log.info("Profile found by email");
            return profile.get();
        }

        log.info("No profile found for identifier: {}", identifier);
        return null;
    }
}
