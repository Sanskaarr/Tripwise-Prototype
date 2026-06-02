package com.tripwise.controller;

import com.tripwise.model.TravelerProfile;
import com.tripwise.service.ProfileService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/profiles")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    @PostMapping("/create")
    public Mono<ResponseEntity<?>> createProfile() {
        log.info("Creating new profile");
        String profileId = "profile_" + System.currentTimeMillis() + "_" +
                java.util.UUID.randomUUID().toString().substring(0, 8);
        return profileService.createProfile(profileId)
                .<ResponseEntity<?>>map(profile -> ResponseEntity.ok(Map.of(
                        "profileId", profile.getProfileId(),
                        "createdAt", profile.getCreatedAt())));
    }

    @PostMapping("/check")
    public Mono<ResponseEntity<?>> checkUserExists(@RequestBody Map<String, String> request) {
        String identifier = request.get("identifier");
        if (identifier == null || identifier.trim().isEmpty()) {
            return Mono.just(ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "error", "Identifier is required")));
        }
        String trimmed = identifier.trim();
        log.info("Checking if user exists: {}", trimmed);
        return profileService.findByIdentifier(trimmed)
                .<ResponseEntity<?>>map(profile -> ResponseEntity.ok(Map.of("exists", true, "profile", profile)))
                .defaultIfEmpty(ResponseEntity.ok(Map.of("exists", false)));
    }

    @GetMapping("/{profileId}")
    public Mono<ResponseEntity<?>> getProfile(@PathVariable String profileId) {
        log.info("Getting profile: {}", profileId);
        return profileService.getProfile(profileId)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @PostMapping("/{profileId}/basicInfo")
    public Mono<ResponseEntity<?>> updateBasicInfo(
            @PathVariable String profileId,
            @RequestBody Map<String, Object> data) {
        log.info("Updating basic info for: {}", profileId);
        return profileService.getProfile(profileId)
                .switchIfEmpty(profileService.createProfile(profileId))
                .flatMap(profile -> {
                    TravelerProfile.BasicInfo basicInfo = TravelerProfile.BasicInfo.builder()
                            .fullName((String) data.get("fullName"))
                            .whatsappNumber((String) data.get("whatsappNumber"))
                            .email((String) data.get("email"))
                            .cityOfDeparture((String) data.get("cityOfDeparture"))
                            .adults((Integer) data.get("adults"))
                            .children((Integer) data.get("children"))
                            .infants((Integer) data.get("infants"))
                            .build();
                    profile.setBasicInfo(basicInfo);
                    return profileService.updateProfile(profile);
                })
                .<ResponseEntity<?>>map(saved -> ResponseEntity.ok(Map.of(
                        "profileId", profileId,
                        "updatedAt", LocalDateTime.now(),
                        "status", "saved")));
    }

    @PostMapping("/{profileId}/dates")
    public Mono<ResponseEntity<?>> updateDates(@PathVariable String profileId, @RequestBody Map<String, Object> data) {
        log.info("Updating dates for: {}", profileId);
        return profileService.getProfile(profileId)
                .switchIfEmpty(Mono.error(new IllegalArgumentException("Profile not found")))
                .flatMap(profile -> {
                    TravelerProfile.TravelDates dates = TravelerProfile.TravelDates.builder()
                            .startDate((String) data.get("startDate"))
                            .returnDate((String) data.get("returnDate"))
                            .isFlexible((Boolean) data.get("isFlexible"))
                            .duration((Integer) data.get("duration"))
                            .build();
                    profile.setDates(dates);
                    return profileService.updateProfile(profile);
                })
                .<ResponseEntity<?>>map(saved -> ResponseEntity.ok(Map.of(
                        "profileId", profileId, "updatedAt", LocalDateTime.now(), "status", "saved")))
                .onErrorResume(IllegalArgumentException.class, e ->
                        Mono.just(ResponseEntity.badRequest().body(Map.of("error", e.getMessage()))));
    }

    @PostMapping("/{profileId}/destination")
    public Mono<ResponseEntity<?>> updateDestination(@PathVariable String profileId, @RequestBody Map<String, Object> data) {
        log.info("Updating destination for: {}", profileId);
        return profileService.getProfile(profileId)
                .switchIfEmpty(Mono.error(new IllegalArgumentException("Profile not found")))
                .flatMap(profile -> {
                    TravelerProfile.Destination destination = TravelerProfile.Destination.builder()
                            .destination((String) data.get("destination"))
                            .travelType((String) data.get("travelType"))
                            .preferenceType((String) data.get("preferenceType"))
                            .travelStyle((String) data.get("travelStyle"))
                            .isFirstVisit((Boolean) data.get("isFirstVisit"))
                            .build();
                    profile.setDestination(destination);
                    return profileService.updateProfile(profile);
                })
                .<ResponseEntity<?>>map(saved -> ResponseEntity.ok(Map.of(
                        "profileId", profileId, "updatedAt", LocalDateTime.now(), "status", "saved")))
                .onErrorResume(IllegalArgumentException.class, e ->
                        Mono.just(ResponseEntity.badRequest().body(Map.of("error", e.getMessage()))));
    }

    @PostMapping("/{profileId}/budget")
    public Mono<ResponseEntity<?>> updateBudget(@PathVariable String profileId, @RequestBody Map<String, Object> data) {
        log.info("Updating budget for: {}", profileId);
        return profileService.getProfile(profileId)
                .switchIfEmpty(Mono.error(new IllegalArgumentException("Profile not found")))
                .flatMap(profile -> {
                    TravelerProfile.Budget budget = TravelerProfile.Budget.builder()
                            .level((String) data.get("level"))
                            .includesFlights((String) data.get("includesFlights"))
                            .build();
                    profile.setBudget(budget);
                    return profileService.updateProfile(profile);
                })
                .<ResponseEntity<?>>map(saved -> ResponseEntity.ok(Map.of(
                        "profileId", profileId, "updatedAt", LocalDateTime.now(), "status", "saved")))
                .onErrorResume(IllegalArgumentException.class, e ->
                        Mono.just(ResponseEntity.badRequest().body(Map.of("error", e.getMessage()))));
    }

    @SuppressWarnings("unchecked")
    @PostMapping("/{profileId}/accommodation")
    public Mono<ResponseEntity<?>> updateAccommodation(@PathVariable String profileId, @RequestBody Map<String, Object> data) {
        log.info("Updating accommodation for: {}", profileId);
        return profileService.getProfile(profileId)
                .switchIfEmpty(Mono.error(new IllegalArgumentException("Profile not found")))
                .flatMap(profile -> {
                    TravelerProfile.Accommodation accommodation = TravelerProfile.Accommodation.builder()
                            .category((String) data.get("category"))
                            .roomType((String) data.get("roomType"))
                            .specialNeeds((List<String>) data.get("specialNeeds"))
                            .build();
                    profile.setAccommodation(accommodation);
                    return profileService.updateProfile(profile);
                })
                .<ResponseEntity<?>>map(saved -> ResponseEntity.ok(Map.of(
                        "profileId", profileId, "updatedAt", LocalDateTime.now(), "status", "saved")))
                .onErrorResume(IllegalArgumentException.class, e ->
                        Mono.just(ResponseEntity.badRequest().body(Map.of("error", e.getMessage()))));
    }

    @PostMapping("/{profileId}/transport")
    public Mono<ResponseEntity<?>> updateTransport(@PathVariable String profileId, @RequestBody Map<String, Object> data) {
        log.info("Updating transport for: {}", profileId);
        return profileService.getProfile(profileId)
                .switchIfEmpty(Mono.error(new IllegalArgumentException("Profile not found")))
                .flatMap(profile -> {
                    TravelerProfile.Transport transport = TravelerProfile.Transport.builder()
                            .mode((String) data.get("mode"))
                            .timingPreference((String) data.get("timingPreference"))
                            .pickupDrop((Boolean) data.get("pickupDrop"))
                            .build();
                    profile.setTransport(transport);
                    return profileService.updateProfile(profile);
                })
                .<ResponseEntity<?>>map(saved -> ResponseEntity.ok(Map.of(
                        "profileId", profileId, "updatedAt", LocalDateTime.now(), "status", "saved")))
                .onErrorResume(IllegalArgumentException.class, e ->
                        Mono.just(ResponseEntity.badRequest().body(Map.of("error", e.getMessage()))));
    }

    @PostMapping("/{profileId}/purpose")
    public Mono<ResponseEntity<?>> updatePurpose(@PathVariable String profileId, @RequestBody Map<String, Object> data) {
        log.info("Updating purpose for: {}", profileId);
        return profileService.getProfile(profileId)
                .switchIfEmpty(Mono.error(new IllegalArgumentException("Profile not found")))
                .flatMap(profile -> {
                    TravelerProfile.Purpose purpose = TravelerProfile.Purpose.builder()
                            .purpose((String) data.get("purpose"))
                            .specialOccasion((String) data.get("specialOccasion"))
                            .build();
                    profile.setPurpose(purpose);
                    return profileService.updateProfile(profile);
                })
                .<ResponseEntity<?>>map(saved -> ResponseEntity.ok(Map.of(
                        "profileId", profileId, "updatedAt", LocalDateTime.now(), "status", "saved")))
                .onErrorResume(IllegalArgumentException.class, e ->
                        Mono.just(ResponseEntity.badRequest().body(Map.of("error", e.getMessage()))));
    }

    @PostMapping("/{profileId}/interests")
    public Mono<ResponseEntity<?>> updateInterests(@PathVariable String profileId, @RequestBody Map<String, Object> data) {
        log.info("Updating interests for: {}", profileId);
        return profileService.getProfile(profileId)
                .switchIfEmpty(Mono.error(new IllegalArgumentException("Profile not found")))
                .flatMap(profile -> {
                    TravelerProfile.Interests interests = TravelerProfile.Interests.builder()
                            .sightseeing((Boolean) data.get("sightseeing"))
                            .relaxation((Boolean) data.get("relaxation"))
                            .adventure((Boolean) data.get("adventure"))
                            .shopping((Boolean) data.get("shopping"))
                            .nature((Boolean) data.get("nature"))
                            .food((Boolean) data.get("food"))
                            .build();
                    profile.setInterests(interests);
                    return profileService.updateProfile(profile);
                })
                .<ResponseEntity<?>>map(saved -> ResponseEntity.ok(Map.of(
                        "profileId", profileId, "updatedAt", LocalDateTime.now(), "status", "saved")))
                .onErrorResume(IllegalArgumentException.class, e ->
                        Mono.just(ResponseEntity.badRequest().body(Map.of("error", e.getMessage()))));
    }

    @PostMapping("/{profileId}/food")
    public Mono<ResponseEntity<?>> updateFood(@PathVariable String profileId, @RequestBody Map<String, Object> data) {
        log.info("Updating food for: {}", profileId);
        return profileService.getProfile(profileId)
                .switchIfEmpty(Mono.error(new IllegalArgumentException("Profile not found")))
                .flatMap(profile -> {
                    TravelerProfile.Food food = TravelerProfile.Food.builder()
                            .type((String) data.get("type"))
                            .allergies((String) data.get("allergies"))
                            .build();
                    profile.setFood(food);
                    return profileService.updateProfile(profile);
                })
                .<ResponseEntity<?>>map(saved -> ResponseEntity.ok(Map.of(
                        "profileId", profileId, "updatedAt", LocalDateTime.now(), "status", "saved")))
                .onErrorResume(IllegalArgumentException.class, e ->
                        Mono.just(ResponseEntity.badRequest().body(Map.of("error", e.getMessage()))));
    }

    @PostMapping("/{profileId}/documents")
    public Mono<ResponseEntity<?>> updateDocuments(@PathVariable String profileId, @RequestBody Map<String, Object> data) {
        log.info("Updating documents for: {}", profileId);
        return profileService.getProfile(profileId)
                .switchIfEmpty(Mono.error(new IllegalArgumentException("Profile not found")))
                .flatMap(profile -> {
                    TravelerProfile.Documents documents = TravelerProfile.Documents.builder()
                            .hasPassport((Boolean) data.get("hasPassport"))
                            .passportExpiry((String) data.get("passportExpiry"))
                            .visaAwareness((String) data.get("visaAwareness"))
                            .build();
                    profile.setDocuments(documents);
                    return profileService.updateProfile(profile);
                })
                .<ResponseEntity<?>>map(saved -> ResponseEntity.ok(Map.of(
                        "profileId", profileId, "updatedAt", LocalDateTime.now(), "status", "saved")))
                .onErrorResume(IllegalArgumentException.class, e ->
                        Mono.just(ResponseEntity.badRequest().body(Map.of("error", e.getMessage()))));
    }

    @PostMapping("/{profileId}/experience")
    public Mono<ResponseEntity<?>> updateExperience(@PathVariable String profileId, @RequestBody Map<String, Object> data) {
        log.info("Updating experience for: {}", profileId);
        return profileService.getProfile(profileId)
                .switchIfEmpty(Mono.error(new IllegalArgumentException("Profile not found")))
                .flatMap(profile -> {
                    TravelerProfile.Experience experience = TravelerProfile.Experience.builder()
                            .frequency((String) data.get("frequency"))
                            .badExperiences((String) data.get("badExperiences"))
                            .build();
                    profile.setExperience(experience);
                    return profileService.updateProfile(profile);
                })
                .<ResponseEntity<?>>map(saved -> ResponseEntity.ok(Map.of(
                        "profileId", profileId, "updatedAt", LocalDateTime.now(), "status", "saved")))
                .onErrorResume(IllegalArgumentException.class, e ->
                        Mono.just(ResponseEntity.badRequest().body(Map.of("error", e.getMessage()))));
    }

    @PostMapping("/{profileId}/communication")
    public Mono<ResponseEntity<?>> updateCommunication(@PathVariable String profileId, @RequestBody Map<String, Object> data) {
        log.info("Updating communication for: {}", profileId);
        return profileService.getProfile(profileId)
                .switchIfEmpty(Mono.error(new IllegalArgumentException("Profile not found")))
                .flatMap(profile -> {
                    TravelerProfile.Communication communication = TravelerProfile.Communication.builder()
                            .method((String) data.get("method"))
                            .bestTime((String) data.get("bestTime"))
                            .build();
                    profile.setCommunication(communication);
                    profile.setStatus("COMPLETED");
                    return profileService.updateProfile(profile);
                })
                .<ResponseEntity<?>>map(saved -> {
                    log.info("Profile completed and ready for trip planning: {}", profileId);
                    return ResponseEntity.ok(Map.of(
                            "profileId", profileId,
                            "updatedAt", LocalDateTime.now(),
                            "status", "saved",
                            "message", "Profile completed! Ready to generate trip plan."));
                })
                .onErrorResume(IllegalArgumentException.class, e ->
                        Mono.just(ResponseEntity.badRequest().body(Map.of("error", e.getMessage()))));
    }

    @PostMapping("/{profileId}/submit")
    public Mono<ResponseEntity<?>> submitProfile(@PathVariable String profileId, @RequestBody Map<String, Object> data) {
        log.info("Submitting profile: {}", profileId);
        return profileService.getProfile(profileId)
                .switchIfEmpty(Mono.error(new IllegalArgumentException("Profile not found")))
                .flatMap(profile -> {
                    profile.setStatus("SUBMITTED");
                    return profileService.updateProfile(profile);
                })
                .<ResponseEntity<?>>map(saved -> ResponseEntity.ok(Map.of(
                        "message", "Profile submitted successfully",
                        "submittedAt", LocalDateTime.now(),
                        "referenceNumber", java.util.UUID.randomUUID().toString())))
                .onErrorResume(IllegalArgumentException.class, e ->
                        Mono.just(ResponseEntity.badRequest().body(Map.of("error", e.getMessage()))));
    }

    @PostMapping("/{profileId}/co-travelers")
    public Mono<ResponseEntity<?>> updateCoTravelers(@PathVariable String profileId,
            @RequestBody List<TravelerProfile.CoTraveler> coTravelers) {
        log.info("Updating co-travelers for: {}", profileId);
        return profileService.getProfile(profileId)
                .switchIfEmpty(Mono.error(new IllegalArgumentException("Profile not found")))
                .flatMap(profile -> {
                    profile.setCoTravelers(coTravelers);
                    return profileService.updateProfile(profile);
                })
                .<ResponseEntity<?>>map(saved -> ResponseEntity.ok(Map.of(
                        "profileId", profileId, "updatedAt", LocalDateTime.now(), "status", "saved")))
                .onErrorResume(IllegalArgumentException.class, e ->
                        Mono.just(ResponseEntity.badRequest().body(Map.of("error", e.getMessage()))));
    }

    @GetMapping("/{profileId}/co-travelers")
    public Mono<ResponseEntity<?>> getCoTravelers(@PathVariable String profileId) {
        return profileService.getProfile(profileId)
                .switchIfEmpty(Mono.error(new IllegalArgumentException("Profile not found")))
                .<ResponseEntity<?>>map(profile ->
                        ResponseEntity.ok(profile.getCoTravelers() != null ? profile.getCoTravelers() : java.util.Collections.emptyList()))
                .onErrorResume(IllegalArgumentException.class, e ->
                        Mono.just(ResponseEntity.badRequest().body(Map.of("error", e.getMessage()))));
    }
}
