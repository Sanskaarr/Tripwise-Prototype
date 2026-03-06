package com.tripwise.service;

import com.tripwise.ai.ChatGPTClient;
import com.tripwise.ai.PerplexityClient;
import com.tripwise.dto.TripRequest;
import com.tripwise.model.TravelerProfile;
import com.tripwise.model.TripPlanSession;
import com.tripwise.prompt.SystemPromptFactory;
import com.tripwise.repository.TravelerProfileRepository;
import com.tripwise.session.TripPlanSessionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
    private final ChatGPTClient chatGPTClient;
    private final PerplexityClient perplexityClient;

    // STEP 1: INIT SESSION & OVERVIEW
    public Mono<TripPlanSession> initSession(String profileId) {
        return Mono.fromCallable(() -> profileRepository.findByProfileId(profileId))
                .subscribeOn(Schedulers.boundedElastic())
                .flatMap(optionalProfile -> optionalProfile
                        .map(profile -> {
                            // Create minimal request object for prompt factory
                            TripRequest request = mapProfileToRequest(profile);

                            String prompt = SystemPromptFactory.createOverviewPrompt(request);

                            return chatGPTClient.generateDraftPlan(prompt) // Reusing generateDraftPlan for generic AI
                                                                           // call
                                    .flatMap(aiResponse -> {
                                        TripPlanSession session = TripPlanSession.builder()
                                                .profileId(profileId)
                                                .createdAt(LocalDateTime.now())
                                                .updatedAt(LocalDateTime.now())
                                                .currentStep(TripPlanSession.PlanningStep.INIT)
                                                .destinationOverview(aiResponse) // Storing the AI's "Overview JSON"
                                                .build();
                                        return sessionRepository.save(session);
                                    });
                        })
                        .orElse(Mono.error(new RuntimeException("Profile not found"))));
    }

    // STEP 2A: GENERATE HOTELS (uses Perplexity for live web-searched prices)
    public Mono<String> generateHotelOptions(String sessionId) {
        return sessionRepository.findById(sessionId)
                .flatMap(session -> Mono.fromCallable(() -> profileRepository.findByProfileId(session.getProfileId()))
                        .subscribeOn(Schedulers.boundedElastic())
                        .flatMap(optionalProfile -> optionalProfile
                                .map(profile -> {
                                    TripRequest request = mapProfileToRequest(profile);

                                    // Use Perplexity (live web search) for real hotel prices
                                    // Fall back to ChatGPT if Perplexity fails
                                    Mono<String> hotelSearch = perplexityClient
                                            .searchHotelOptions(
                                                    request.getDestination(),
                                                    request.getBudgetLevel(),
                                                    request.getTravelStyle())
                                            .onErrorResume(ex -> {
                                                log.warn("Perplexity hotel search failed, falling back to ChatGPT: {}",
                                                        ex.getMessage());
                                                return chatGPTClient.generateDraftPlan(
                                                        SystemPromptFactory.createHotelOptionsPrompt(request));
                                            });

                                    return hotelSearch.flatMap(rawResponse -> {
                                        String jsonResponse = cleanJson(rawResponse);
                                        session.setSuggestedHotelsJson(jsonResponse);
                                        session.setCurrentStep(TripPlanSession.PlanningStep.HOTEL_SELECTION);
                                        session.setUpdatedAt(LocalDateTime.now());
                                        return sessionRepository.save(session).<String>map(s -> jsonResponse);
                                    });
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

                                    // Get Arrival Mode from Profile (default to Flight if missing)
                                    String arrivalMode = (profile.getTransport() != null
                                            && profile.getTransport().getMode() != null)
                                                    ? profile.getTransport().getMode()
                                                    : "Flight";

                                    String prompt = SystemPromptFactory.createTransportPrompt(
                                            request,
                                            session.getSelectedHotel().getName(),
                                            session.getSelectedHotel().getAddress(),
                                            arrivalMode);

                                    return chatGPTClient.generateDraftPlan(prompt)
                                            .flatMap(jsonResponse -> {
                                                session.setSuggestedTransportJson(jsonResponse);
                                                session.setCurrentStep(
                                                        TripPlanSession.PlanningStep.TRANSPORT_SELECTION);
                                                session.setUpdatedAt(LocalDateTime.now());
                                                return sessionRepository.save(session).map(s -> jsonResponse);
                                            });
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

                                    String prompt = SystemPromptFactory.createMasterPlanPrompt(
                                            request,
                                            session.getSelectedHotel().getName(),
                                            session.getFinalizedTransportChoice().getMode(),
                                            "Research already integrated in logic");

                                    return chatGPTClient.generateFinalResponse(prompt)
                                            .flatMap(finalPlan -> {
                                                session.setCurrentStep(TripPlanSession.PlanningStep.FINALIZED);
                                                session.setUpdatedAt(LocalDateTime.now());
                                                return sessionRepository.save(session).map(s -> finalPlan);
                                            });
                                })
                                .orElse(Mono.error(new RuntimeException("Profile not found")))));
    }

    // Helper to map DB Profile -> Prompt Request
    private TripRequest mapProfileToRequest(TravelerProfile profile) {
        TripRequest request = new TripRequest();
        if (profile.getDestination() != null)
            request.setDestination(profile.getDestination().getDestination());
        if (profile.getBudget() != null)
            request.setBudgetLevel(profile.getBudget().getLevel());
        if (profile.getDestination() != null)
            request.setTravelStyle(profile.getDestination().getTravelStyle() != null
                    ? profile.getDestination().getTravelStyle()
                    : "balanced");
        if (profile.getDates() != null)
            request.setDays(profile.getDates().getDuration());
        request.setUserCountry("India"); // Default or fetch from profile if available
        return request;
    }

    private String cleanJson(String response) {
        if (response == null)
            return "{}";
        String cleaned = response.trim();
        if (cleaned.startsWith("```json")) {
            cleaned = cleaned.substring(7);
        } else if (cleaned.startsWith("```")) {
            cleaned = cleaned.substring(3);
        }
        if (cleaned.endsWith("```")) {
            cleaned = cleaned.substring(0, cleaned.length() - 3);
        }
        return cleaned.trim();
    }
}
