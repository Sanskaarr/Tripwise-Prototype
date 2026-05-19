package com.tripwise.service;

import com.tripwise.ai.GeminiClient;
import com.tripwise.config.AIPrompts;
import com.tripwise.dto.TripRequest;
import com.tripwise.model.TravelerProfile;
import com.tripwise.model.TripPlanSession;
import com.tripwise.repository.TravelerProfileRepository;
import com.tripwise.session.TripPlanSessionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.time.LocalDateTime;

@Service
@Slf4j
@RequiredArgsConstructor
public class InteractivePlanningService {

    private final TripPlanSessionRepository sessionRepository;
    private final TravelerProfileRepository profileRepository;
    private final GeminiClient geminiClient;

    @Value("${app.default.user.country:India}")
    private String defaultUserCountry;

    // STEP 0a: GET SESSION BY ID
    public Mono<TripPlanSession> getSessionById(String sessionId) {
        return sessionRepository.findById(sessionId);
    }

    // STEP 0: GET EXISTING SESSION (latest for profile)
    public Mono<TripPlanSession> getLatestSession(String profileId) {
        return sessionRepository.findByProfileId(profileId)
                .sort((s1, s2) -> s2.getUpdatedAt().compareTo(s1.getUpdatedAt()))
                .next();
    }

    // STEP 1: INIT SESSION & OVERVIEW
    public Mono<TripPlanSession> initSession(String profileId) {
        return Mono.fromCallable(() -> profileRepository.findByProfileId(profileId))
                .subscribeOn(Schedulers.boundedElastic())
                .flatMap(optionalProfile -> optionalProfile
                        .map(profile -> {
                            TripRequest request = mapProfileToRequest(profile);
                            String systemPrompt = "You are a professional travel planner. Provide a brief, inspiring overview of the destination "
                                    + request.getDestination() + " for a " + request.getDays()
                                    + " day trip. Return the response as a JSON object with fields: destination, overview, weatherForecast, estimatedCost, highlights (array).";
                            String userPrompt = "Create a trip overview for " + request.getDestination();

                            return geminiClient.generateResponse(systemPrompt, userPrompt)
                                    .flatMap(aiResponse -> {
                                        TripPlanSession session = TripPlanSession.builder()
                                                .profileId(profileId)
                                                .destination(request.getDestination())
                                                .createdAt(LocalDateTime.now())
                                                .updatedAt(LocalDateTime.now())
                                                .currentStep(TripPlanSession.PlanningStep.INIT)
                                                .destinationOverview(cleanJson(aiResponse))
                                                .build();
                                        return sessionRepository.save(session);
                                    })
                                    .switchIfEmpty(Mono.error(new RuntimeException("Failed to generate trip overview")));
                        })
                        .orElse(Mono.error(new RuntimeException("Profile not found"))));
    }

    // STEP 2A: GENERATE HOTELS
    public Mono<String> generateHotelOptions(String sessionId) {
        return sessionRepository.findById(sessionId)
                .flatMap(session -> Mono.fromCallable(() -> profileRepository.findByProfileId(session.getProfileId()))
                        .subscribeOn(Schedulers.boundedElastic())
                        .flatMap(optionalProfile -> optionalProfile
                                .map(profile -> {
                                    TripRequest request = mapProfileToRequest(profile);
                                    String systemPrompt = "Find 3 best hotel options for " + request.getDestination()
                                            + " with budget " + request.getBudgetLevel()
                                            + ". Return a JSON object with an 'options' array. Each option should have: name, address, costPerNight, reason.";
                                    String userPrompt = "Find hotels in " + request.getDestination();

                                    return geminiClient.generateResponse(systemPrompt, userPrompt)
                                            .flatMap(rawResponse -> {
                                                String jsonResponse = cleanJson(rawResponse);
                                                session.setSuggestedHotelsJson(jsonResponse);
                                                session.setCurrentStep(TripPlanSession.PlanningStep.HOTEL_SELECTION);
                                                session.setUpdatedAt(LocalDateTime.now());
                                                return sessionRepository.save(session).<String>map(s -> jsonResponse);
                                            })
                                            .switchIfEmpty(Mono.error(new RuntimeException("Failed to generate hotel options")));
                                })
                                .orElse(Mono.<String>error(new RuntimeException("Profile not found")))));
    }

    // STEP 2B: SELECT HOTEL
    public Mono<TripPlanSession> selectHotel(String sessionId, TripPlanSession.HotelOption selectedHotel) {
        return sessionRepository.findById(sessionId)
                .flatMap(session -> {
                    session.setSelectedHotel(selectedHotel);
                    session.setUpdatedAt(LocalDateTime.now());
                    return sessionRepository.save(session);
                });
    }

    // STEP 3A: GENERATE TRANSPORT
    public Mono<String> generateTransportOptions(String sessionId) {
        return sessionRepository.findById(sessionId)
                .flatMap(session -> Mono.fromCallable(() -> profileRepository.findByProfileId(session.getProfileId()))
                        .subscribeOn(Schedulers.boundedElastic())
                        .flatMap(optionalProfile -> optionalProfile
                                .map(profile -> {
                                    TripRequest request = mapProfileToRequest(profile);
                                    String systemPrompt = "Suggest 3 transport options in " + request.getDestination()
                                            + " starting from " + session.getSelectedHotel().getAddress()
                                            + ". Return a JSON object with an 'options' array. Each option: mode, cost, duration, details.";
                                    String userPrompt = "Find transport for my trip in " + request.getDestination();

                                    return geminiClient.generateResponse(systemPrompt, userPrompt)
                                            .flatMap(jsonResponse -> {
                                                String cleaned = cleanJson(jsonResponse);
                                                session.setSuggestedTransportJson(cleaned);
                                                session.setCurrentStep(TripPlanSession.PlanningStep.TRANSPORT_SELECTION);
                                                session.setUpdatedAt(LocalDateTime.now());
                                                return sessionRepository.save(session).map(s -> cleaned);
                                            })
                                            .switchIfEmpty(Mono.error(new RuntimeException("Failed to generate transport options")));
                                })
                                .orElse(Mono.error(new RuntimeException("Profile not found")))));
    }

    // STEP 3B: SELECT TRANSPORT
    public Mono<TripPlanSession> selectTransport(String sessionId, TripPlanSession.TransportOption selectedTransport) {
        return sessionRepository.findById(sessionId)
                .flatMap(session -> {
                    session.setFinalizedTransportChoice(selectedTransport);
                    session.setUpdatedAt(LocalDateTime.now());
                    return sessionRepository.save(session);
                });
    }

    // STEP 4: GENERATE MASTER PLAN
    public Mono<String> generateMasterPlan(String sessionId) {
        return sessionRepository.findById(sessionId)
                .flatMap(session -> Mono.fromCallable(() -> profileRepository.findByProfileId(session.getProfileId()))
                        .subscribeOn(Schedulers.boundedElastic())
                        .flatMap(optionalProfile -> optionalProfile
                                .map(profile -> {
                                    TripRequest request = mapProfileToRequest(profile);
                                    String destination = session.getDestination() != null
                                            ? session.getDestination() : request.getDestination();
                                    String systemPrompt = AIPrompts.getMasterPlanJsonPrompt(destination);
                                    String userPrompt = "Create a detailed day-by-day itinerary for " + destination
                                            + ". Duration: " + request.getDays() + " days. Budget level: " + request.getBudgetLevel()
                                            + ". I am staying at '" + session.getSelectedHotel().getName()
                                            + "' (" + session.getSelectedHotel().getAddress() + ")"
                                            + " and using '" + session.getFinalizedTransportChoice().getMode() + "' as my primary local transport.";

                                    return geminiClient.generateJsonResponse(systemPrompt, userPrompt)
                                            .flatMap(finalPlan -> {
                                                session.setCurrentStep(TripPlanSession.PlanningStep.FINALIZED);
                                                session.setMasterPlan(finalPlan);
                                                session.setUpdatedAt(LocalDateTime.now());
                                                return sessionRepository.save(session).map(s -> finalPlan);
                                            })
                                            .switchIfEmpty(Mono.error(new RuntimeException("Failed to generate master plan")));
                                })
                                .orElse(Mono.error(new RuntimeException("Profile not found")))));
    }

    private TripRequest mapProfileToRequest(TravelerProfile profile) {
        TripRequest request = new TripRequest();
        if (profile.getDestination() != null)
            request.setDestination(profile.getDestination().getDestination());
        if (profile.getBudget() != null)
            request.setBudgetLevel(profile.getBudget().getLevel());
        if (profile.getDestination() != null)
            request.setTravelStyle(profile.getDestination().getTravelStyle() != null
                    ? profile.getDestination().getTravelStyle() : "balanced");
        if (profile.getDates() != null)
            request.setDays(profile.getDates().getDuration());
        request.setUserCountry(defaultUserCountry);
        return request;
    }

    private String cleanJson(String response) {
        if (response == null) return "{}";
        String cleaned = response.trim();
        if (cleaned.startsWith("```json")) cleaned = cleaned.substring(7);
        else if (cleaned.startsWith("```")) cleaned = cleaned.substring(3);
        if (cleaned.endsWith("```")) cleaned = cleaned.substring(0, cleaned.length() - 3);
        return cleaned.trim();
    }
}
