package com.tripwise.controller;

import com.tripwise.model.TravelerProfile;
import com.tripwise.service.ProfileService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/profiles")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    /**
     * Create new profile
     */
    @PostMapping("/create")
    public ResponseEntity<?> createProfile() {
        log.info("Creating new profile");

        String profileId = "profile_" + System.currentTimeMillis() + "_" +
                java.util.UUID.randomUUID().toString().substring(0, 8);

        TravelerProfile profile = profileService.createProfile(profileId);

        return ResponseEntity.ok(Map.of(
                "profileId", profile.getProfileId(),
                "createdAt", profile.getCreatedAt()));
    }

    /**
     * Check if user exists by phone or email
     */
    @PostMapping("/check")
    public ResponseEntity<?> checkUserExists(@RequestBody Map<String, String> request) {
        String identifier = request.get("identifier");
        log.info("Checking if user exists: {}", identifier);

        if (identifier == null || identifier.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "error", "Identifier is required"));
        }

        TravelerProfile profile = profileService.findByIdentifier(identifier.trim());

        if (profile != null) {
            // User exists - return profile
            return ResponseEntity.ok(Map.of(
                    "exists", true,
                    "profile", profile));
        } else {
            // New user
            return ResponseEntity.ok(Map.of("exists", false));
        }
    }

    /**
     * Get complete profile
     */
    @GetMapping("/{profileId}")
    public ResponseEntity<?> getProfile(@PathVariable String profileId) {
        log.info("Getting profile: {}", profileId);

        TravelerProfile profile = profileService.getProfile(profileId);

        if (profile == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(profile);
    }

    /**
     * Update basic info (Step 1)
     */
    @PostMapping("/{profileId}/basicInfo")
    public ResponseEntity<?> updateBasicInfo(
            @PathVariable String profileId,
            @RequestBody Map<String, Object> data) {
        log.info("Updating basic info for: {}", profileId);

        TravelerProfile profile = profileService.getProfile(profileId);

        if (profile == null) {
            // Create profile if doesn't exist
            profile = profileService.createProfile(profileId);
        }

        // Map data to BasicInfo using builder
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
        profileService.updateProfile(profile);

        log.info("Basic info updated for: {}", profileId);

        return ResponseEntity.ok(Map.of(
                "profileId", profileId,
                "updatedAt", LocalDateTime.now(),
                "status", "saved"));
    }

    // [Continue with remaining endpoints - dates, destination, budget, etc.]
    // Keeping the same logic but using the builder pattern for nested objects

    @PostMapping("/{profileId}/dates")
    public ResponseEntity<?> updateDates(@PathVariable String profileId, @RequestBody Map<String, Object> data) {
        log.info("Updating dates for: {}", profileId);
        TravelerProfile profile = profileService.getProfile(profileId);
        if (profile == null)
            return ResponseEntity.badRequest().body(Map.of("error", "Profile not found"));

        TravelerProfile.TravelDates dates = TravelerProfile.TravelDates.builder()
                .startDate((String) data.get("startDate"))
                .returnDate((String) data.get("returnDate"))
                .isFlexible((Boolean) data.get("isFlexible"))
                .duration((Integer) data.get("duration"))
                .build();

        profile.setDates(dates);
        profileService.updateProfile(profile);
        return ResponseEntity.ok(Map.of("profileId", profileId, "updatedAt", LocalDateTime.now(), "status", "saved"));
    }

    @PostMapping("/{profileId}/destination")
    public ResponseEntity<?> updateDestination(@PathVariable String profileId, @RequestBody Map<String, Object> data) {
        log.info("Updating destination for: {}", profileId);
        TravelerProfile profile = profileService.getProfile(profileId);
        if (profile == null)
            return ResponseEntity.badRequest().body(Map.of("error", "Profile not found"));

        TravelerProfile.Destination destination = TravelerProfile.Destination.builder()
                .destination((String) data.get("destination"))
                .travelType((String) data.get("travelType"))
                .preferenceType((String) data.get("preferenceType"))
                .travelStyle((String) data.get("travelStyle"))
                .isFirstVisit((Boolean) data.get("isFirstVisit"))
                .build();

        profile.setDestination(destination);
        profileService.updateProfile(profile);
        return ResponseEntity.ok(Map.of("profileId", profileId, "updatedAt", LocalDateTime.now(), "status", "saved"));
    }

    @PostMapping("/{profileId}/budget")
    public ResponseEntity<?> updateBudget(@PathVariable String profileId, @RequestBody Map<String, Object> data) {
        log.info("Updating budget for: {}", profileId);
        TravelerProfile profile = profileService.getProfile(profileId);
        if (profile == null)
            return ResponseEntity.badRequest().body(Map.of("error", "Profile not found"));

        TravelerProfile.Budget budget = TravelerProfile.Budget.builder()
                .level((String) data.get("level"))
                .includesFlights((String) data.get("includesFlights"))
                .build();

        profile.setBudget(budget);
        profileService.updateProfile(profile);
        return ResponseEntity.ok(Map.of("profileId", profileId, "updatedAt", LocalDateTime.now(), "status", "saved"));
    }

    @SuppressWarnings("unchecked")
    @PostMapping("/{profileId}/accommodation")
    public ResponseEntity<?> updateAccommodation(@PathVariable String profileId,
            @RequestBody Map<String, Object> data) {
        log.info("Updating accommodation for: {}", profileId);
        TravelerProfile profile = profileService.getProfile(profileId);
        if (profile == null)
            return ResponseEntity.badRequest().body(Map.of("error", "Profile not found"));

        TravelerProfile.Accommodation accommodation = TravelerProfile.Accommodation.builder()
                .category((String) data.get("category"))
                .roomType((String) data.get("roomType"))
                .specialNeeds((java.util.List<String>) data.get("specialNeeds"))
                .build();

        profile.setAccommodation(accommodation);
        profileService.updateProfile(profile);
        return ResponseEntity.ok(Map.of("profileId", profileId, "updatedAt", LocalDateTime.now(), "status", "saved"));
    }

    @PostMapping("/{profileId}/transport")
    public ResponseEntity<?> updateTransport(@PathVariable String profileId, @RequestBody Map<String, Object> data) {
        log.info("Updating transport for: {}", profileId);
        TravelerProfile profile = profileService.getProfile(profileId);
        if (profile == null)
            return ResponseEntity.badRequest().body(Map.of("error", "Profile not found"));

        TravelerProfile.Transport transport = TravelerProfile.Transport.builder()
                .mode((String) data.get("mode"))
                .timingPreference((String) data.get("timingPreference"))
                .pickupDrop((Boolean) data.get("pickupDrop"))
                .build();

        profile.setTransport(transport);
        profileService.updateProfile(profile);
        return ResponseEntity.ok(Map.of("profileId", profileId, "updatedAt", LocalDateTime.now(), "status", "saved"));
    }

    @PostMapping("/{profileId}/purpose")
    public ResponseEntity<?> updatePurpose(@PathVariable String profileId, @RequestBody Map<String, Object> data) {
        log.info("Updating purpose for: {}", profileId);
        TravelerProfile profile = profileService.getProfile(profileId);
        if (profile == null)
            return ResponseEntity.badRequest().body(Map.of("error", "Profile not found"));

        TravelerProfile.Purpose purpose = TravelerProfile.Purpose.builder()
                .purpose((String) data.get("purpose"))
                .specialOccasion((String) data.get("specialOccasion"))
                .build();

        profile.setPurpose(purpose);
        profileService.updateProfile(profile);
        return ResponseEntity.ok(Map.of("profileId", profileId, "updatedAt", LocalDateTime.now(), "status", "saved"));
    }

    @PostMapping("/{profileId}/interests")
    public ResponseEntity<?> updateInterests(@PathVariable String profileId, @RequestBody Map<String, Object> data) {
        log.info("Updating interests for: {}", profileId);
        TravelerProfile profile = profileService.getProfile(profileId);
        if (profile == null)
            return ResponseEntity.badRequest().body(Map.of("error", "Profile not found"));

        TravelerProfile.Interests interests = TravelerProfile.Interests.builder()
                .sightseeing((Boolean) data.get("sightseeing"))
                .relaxation((Boolean) data.get("relaxation"))
                .adventure((Boolean) data.get("adventure"))
                .shopping((Boolean) data.get("shopping"))
                .nature((Boolean) data.get("nature"))
                .food((Boolean) data.get("food"))
                .build();

        profile.setInterests(interests);
        profileService.updateProfile(profile);
        return ResponseEntity.ok(Map.of("profileId", profileId, "updatedAt", LocalDateTime.now(), "status", "saved"));
    }

    @PostMapping("/{profileId}/food")
    public ResponseEntity<?> updateFood(@PathVariable String profileId, @RequestBody Map<String, Object> data) {
        log.info("Updating food for: {}", profileId);
        TravelerProfile profile = profileService.getProfile(profileId);
        if (profile == null)
            return ResponseEntity.badRequest().body(Map.of("error", "Profile not found"));

        TravelerProfile.Food food = TravelerProfile.Food.builder()
                .type((String) data.get("type"))
                .allergies((String) data.get("allergies"))
                .build();

        profile.setFood(food);
        profileService.updateProfile(profile);
        return ResponseEntity.ok(Map.of("profileId", profileId, "updatedAt", LocalDateTime.now(), "status", "saved"));
    }

    @PostMapping("/{profileId}/documents")
    public ResponseEntity<?> updateDocuments(@PathVariable String profileId, @RequestBody Map<String, Object> data) {
        log.info("Updating documents for: {}", profileId);
        TravelerProfile profile = profileService.getProfile(profileId);
        if (profile == null)
            return ResponseEntity.badRequest().body(Map.of("error", "Profile not found"));

        TravelerProfile.Documents documents = TravelerProfile.Documents.builder()
                .hasPassport((Boolean) data.get("hasPassport"))
                .passportExpiry((String) data.get("passportExpiry"))
                .visaAwareness((String) data.get("visaAwareness"))
                .build();

        profile.setDocuments(documents);
        profileService.updateProfile(profile);
        return ResponseEntity.ok(Map.of("profileId", profileId, "updatedAt", LocalDateTime.now(), "status", "saved"));
    }

    @PostMapping("/{profileId}/experience")
    public ResponseEntity<?> updateExperience(@PathVariable String profileId, @RequestBody Map<String, Object> data) {
        log.info("Updating experience for: {}", profileId);
        TravelerProfile profile = profileService.getProfile(profileId);
        if (profile == null)
            return ResponseEntity.badRequest().body(Map.of("error", "Profile not found"));

        TravelerProfile.Experience experience = TravelerProfile.Experience.builder()
                .frequency((String) data.get("frequency"))
                .badExperiences((String) data.get("badExperiences"))
                .build();

        profile.setExperience(experience);
        profileService.updateProfile(profile);
        return ResponseEntity.ok(Map.of("profileId", profileId, "updatedAt", LocalDateTime.now(), "status", "saved"));
    }

    @PostMapping("/{profileId}/communication")
    public ResponseEntity<?> updateCommunication(@PathVariable String profileId,
            @RequestBody Map<String, Object> data) {
        log.info("Updating communication for: {}", profileId);
        TravelerProfile profile = profileService.getProfile(profileId);
        if (profile == null)
            return ResponseEntity.badRequest().body(Map.of("error", "Profile not found"));

        TravelerProfile.Communication communication = TravelerProfile.Communication.builder()
                .method((String) data.get("method"))
                .bestTime((String) data.get("bestTime"))
                .build();

        profile.setCommunication(communication);
        profile.setStatus("COMPLETED");

        profileService.updateProfile(profile);

        log.info("Profile completed and ready for trip planning: {}", profileId);

        return ResponseEntity.ok(Map.of(
                "profileId", profileId,
                "updatedAt", LocalDateTime.now(),
                "status", "saved",
                "message", "Profile completed! Ready to generate trip plan."));
    }

    @PostMapping("/{profileId}/submit")
    public ResponseEntity<?> submitProfile(@PathVariable String profileId, @RequestBody Map<String, Object> data) {
        log.info("Submitting profile: {}", profileId);
        TravelerProfile profile = profileService.getProfile(profileId);
        if (profile == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Profile not found"));
        }

        // Mark as submitted
        profile.setStatus("SUBMITTED");
        profileService.updateProfile(profile);

        return ResponseEntity.ok(Map.of(
                "message", "Profile submitted successfully",
                "submittedAt", LocalDateTime.now(),
                "referenceNumber", java.util.UUID.randomUUID().toString()));
    }

    @PostMapping("/{profileId}/co-travelers")
    public ResponseEntity<?> updateCoTravelers(@PathVariable String profileId,
            @RequestBody List<TravelerProfile.CoTraveler> coTravelers) {
        log.info("Updating co-travelers for: {}", profileId);
        TravelerProfile profile = profileService.getProfile(profileId);
        if (profile == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Profile not found"));
        }

        profile.setCoTravelers(coTravelers);
        profileService.updateProfile(profile);
        return ResponseEntity.ok(Map.of("profileId", profileId, "updatedAt", LocalDateTime.now(), "status", "saved"));
    }

    @GetMapping("/{profileId}/co-travelers")
    public ResponseEntity<?> getCoTravelers(@PathVariable String profileId) {
        TravelerProfile profile = profileService.getProfile(profileId);
        if (profile == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Profile not found"));
        }
        return ResponseEntity
                .ok(profile.getCoTravelers() != null ? profile.getCoTravelers() : java.util.Collections.emptyList());
    }
}
