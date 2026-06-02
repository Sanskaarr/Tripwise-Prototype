package com.tripwise.service;

import com.tripwise.model.TravelerProfile;
import com.tripwise.reactive.repository.ReactiveTravelerProfileRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class ProfileServiceTest {

    @Mock
    private ReactiveTravelerProfileRepository repository;

    @InjectMocks
    private ProfileService profileService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCreateProfile() {
        String profileId = "user123";
        TravelerProfile mockProfile = TravelerProfile.builder()
                .profileId(profileId)
                .status("DRAFT")
                .build();

        when(repository.save(any(TravelerProfile.class))).thenReturn(Mono.just(mockProfile));

        Mono<TravelerProfile> result = profileService.createProfile(profileId);

        StepVerifier.create(result)
                .expectNextMatches(profile -> profile.getProfileId().equals(profileId) && profile.getStatus().equals("DRAFT"))
                .verifyComplete();

        verify(repository, times(1)).save(any(TravelerProfile.class));
    }

    @Test
    void testGetProfile() {
        String profileId = "user123";
        TravelerProfile mockProfile = TravelerProfile.builder()
                .profileId(profileId)
                .status("DRAFT")
                .build();

        when(repository.findByProfileId(profileId)).thenReturn(Mono.just(mockProfile));

        Mono<TravelerProfile> result = profileService.getProfile(profileId);

        StepVerifier.create(result)
                .expectNext(mockProfile)
                .verifyComplete();

        verify(repository, times(1)).findByProfileId(profileId);
    }

    @Test
    void testGetProfile_NotFound() {
        String profileId = "unknown";

        when(repository.findByProfileId(profileId)).thenReturn(Mono.empty());

        Mono<TravelerProfile> result = profileService.getProfile(profileId);

        StepVerifier.create(result)
                .verifyComplete();

        verify(repository, times(1)).findByProfileId(profileId);
    }

    @Test
    void testUpdateProfile() {
        TravelerProfile inputProfile = TravelerProfile.builder()
                .profileId("user123")
                .status("COMPLETED")
                .build();

        when(repository.save(any(TravelerProfile.class))).thenReturn(Mono.just(inputProfile));

        Mono<TravelerProfile> result = profileService.updateProfile(inputProfile);

        StepVerifier.create(result)
                .expectNext(inputProfile)
                .verifyComplete();

        verify(repository, times(1)).save(any(TravelerProfile.class));
    }

    @Test
    void testProfileExists() {
        String profileId = "user123";
        when(repository.existsByProfileId(profileId)).thenReturn(Mono.just(true));

        Mono<Boolean> result = profileService.profileExists(profileId);

        StepVerifier.create(result)
                .expectNext(true)
                .verifyComplete();

        verify(repository, times(1)).existsByProfileId(profileId);
    }

    @Test
    void testFindByIdentifier_Whatsapp() {
        String identifier = "1234567890";
        TravelerProfile mockProfile = TravelerProfile.builder()
                .profileId("user123")
                .basicInfo(TravelerProfile.BasicInfo.builder().whatsappNumber(identifier).build())
                .build();

        when(repository.findByBasicInfo_WhatsappNumber(identifier)).thenReturn(Mono.just(mockProfile));
        when(repository.findByBasicInfo_Email(identifier)).thenReturn(Mono.empty());

        Mono<TravelerProfile> result = profileService.findByIdentifier(identifier);

        StepVerifier.create(result)
                .expectNext(mockProfile)
                .verifyComplete();

        verify(repository, times(1)).findByBasicInfo_WhatsappNumber(identifier);
        verify(repository, never()).findByBasicInfo_Email(anyString());
    }

    @Test
    void testFindByIdentifier_EmailFallback() {
        String identifier = "test@example.com";
        TravelerProfile mockProfile = TravelerProfile.builder()
                .profileId("user123")
                .basicInfo(TravelerProfile.BasicInfo.builder().email(identifier).build())
                .build();

        when(repository.findByBasicInfo_WhatsappNumber(identifier)).thenReturn(Mono.empty());
        when(repository.findByBasicInfo_Email(identifier)).thenReturn(Mono.just(mockProfile));

        Mono<TravelerProfile> result = profileService.findByIdentifier(identifier);

        StepVerifier.create(result)
                .expectNext(mockProfile)
                .verifyComplete();

        verify(repository, times(1)).findByBasicInfo_WhatsappNumber(identifier);
        verify(repository, times(1)).findByBasicInfo_Email(identifier);
    }
}
