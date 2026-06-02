package com.tripwise.service;

import com.tripwise.model.TravelerProfile;
import com.tripwise.reactive.repository.ReactiveTravelerProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProfileService {

    private final ReactiveTravelerProfileRepository repository;

    public Mono<TravelerProfile> createProfile(String profileId) {
        log.info("Creating new profile: {}", profileId);
        TravelerProfile profile = TravelerProfile.builder()
                .profileId(profileId)
                .status("DRAFT")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        return repository.save(profile)
                .doOnSuccess(saved -> log.info("Profile created successfully: {}", saved.getProfileId()));
    }

    public Mono<TravelerProfile> getProfile(String profileId) {
        log.info("Fetching profile: {}", profileId);
        return repository.findByProfileId(profileId)
                .switchIfEmpty(Mono.defer(() -> {
                    log.warn("Profile not found: {}", profileId);
                    return Mono.empty();
                }));
    }

    public Mono<TravelerProfile> updateProfile(TravelerProfile profile) {
        log.info("Updating profile: {}", profile.getProfileId());
        profile.setUpdatedAt(LocalDateTime.now());
        return repository.save(profile)
                .doOnSuccess(saved -> log.info("Profile updated successfully: {}", saved.getProfileId()));
    }

    public Mono<Boolean> profileExists(String profileId) {
        return repository.existsByProfileId(profileId);
    }

    public Mono<TravelerProfile> findByIdentifier(String identifier) {
        log.info("Finding profile by identifier: {}", identifier);
        return repository.findByBasicInfo_WhatsappNumber(identifier)
                .switchIfEmpty(Mono.defer(() -> repository.findByBasicInfo_Email(identifier)))
                .doOnNext(p -> log.info("Profile found for identifier: {}", identifier))
                .switchIfEmpty(Mono.defer(() -> {
                    log.info("No profile found for identifier: {}", identifier);
                    return Mono.empty();
                }));
    }
}
