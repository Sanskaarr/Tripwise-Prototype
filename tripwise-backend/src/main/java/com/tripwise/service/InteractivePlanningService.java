package com.tripwise.service;

import com.tripwise.ai.GeminiClient;
import com.tripwise.config.AIPrompts;

import com.tripwise.model.TravelerProfile;
import com.tripwise.model.TripPlanSession;
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
    private final GeminiClient geminiClient;

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
                            String dest = profile.getDestination() != null && profile.getDestination().getDestination() != null 
                                    ? profile.getDestination().getDestination() : "your destination";
                            int days = profile.getDates() != null && profile.getDates().getDuration() != null 
                                    ? profile.getDates().getDuration() : 3;

                            String systemPrompt = "You are a professional travel planner. Provide a brief, inspiring overview of the destination "
                                    + dest + " for a " + days
                                    + " day trip. Return the response as a JSON object with fields: destination, overview, weatherForecast, estimatedCost, highlights (array).";
                            String userPrompt = "Create a trip overview for " + dest;

                            return geminiClient.generateResponse(systemPrompt, userPrompt)
                                    .flatMap(aiResponse -> {
                                        TripPlanSession session = TripPlanSession.builder()
                                                .profileId(profileId)
                                                .destination(dest)
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
                                    String dest = profile.getDestination() != null && profile.getDestination().getDestination() != null 
                                            ? profile.getDestination().getDestination() : "your destination";
                                    String budget = profile.getBudget() != null && profile.getBudget().getLevel() != null 
                                            ? profile.getBudget().getLevel() : "medium";

                                    String systemPrompt = "Find 3 best hotel options for " + dest
                                            + " with budget " + budget
                                            + ". Return a JSON object with an 'options' array. Each option should have: name, address, costPerNight, reason.";
                                    String userPrompt = "Find hotels in " + dest;

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
                                    String dest = profile.getDestination() != null && profile.getDestination().getDestination() != null 
                                            ? profile.getDestination().getDestination() : "your destination";

                                    String systemPrompt = "Suggest 3 transport options in " + dest
                                            + " starting from " + session.getSelectedHotel().getAddress()
                                            + ". Return a JSON object with an 'options' array. Each option: mode, cost, duration, details.";
                                    String userPrompt = "Find transport for my trip in " + dest;

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
    public Mono<String> generateMasterPlan(String sessionId, java.util.List<java.util.Map<String, String>> chatHistory) {
        log.info("generateMasterPlan → sessionId={} | chatMessages={}", sessionId, chatHistory != null ? chatHistory.size() : 0);
        return sessionRepository.findById(sessionId)
                .flatMap(session -> Mono.fromCallable(() -> profileRepository.findByProfileId(session.getProfileId()))
                        .subscribeOn(Schedulers.boundedElastic())
                        .flatMap(optionalProfile -> optionalProfile
                                .map(profile -> {
                                    String destFromProfile = profile.getDestination() != null && profile.getDestination().getDestination() != null 
                                            ? profile.getDestination().getDestination() : "your destination";
                                    int days = profile.getDates() != null && profile.getDates().getDuration() != null 
                                            ? profile.getDates().getDuration() : 3;
                                    String budget = profile.getBudget() != null && profile.getBudget().getLevel() != null 
                                            ? profile.getBudget().getLevel() : "medium";

                                    String destination = session.getDestination() != null
                                            ? session.getDestination() : destFromProfile;
                                    String systemPrompt = AIPrompts.getMasterPlanJsonPrompt(destination);

                                    // Build chat transcript for Gemini compilation
                                    StringBuilder historyBuilder = new StringBuilder();
                                    historyBuilder.append("Conversation history between traveler and AI travel agent:\n\n");
                                    if (chatHistory != null) {
                                        for (java.util.Map<String, String> msg : chatHistory) {
                                            String role = msg.get("role");
                                            String content = msg.get("content");
                                            historyBuilder.append(role != null && role.equalsIgnoreCase("assistant") ? "Agent: " : "Traveler: ")
                                                          .append(content).append("\n\n");
                                        }
                                    }

                                    String userPrompt = historyBuilder.toString()
                                            + "\nBased on the above conversation, extract the final agreed-upon hotel, transport choices (flights or trains), and day-by-day itinerary to " + destination
                                            + ". Trip duration: " + days + " days. Budget level: " + budget + ". "
                                            + "Compile into a single valid JSON object following the required schema. "
                                            + "Preserve the specific hotel, transport, and activity choices discussed in the chat. "
                                            + "Costs should be realistic for the " + budget + " budget level.";

                                    return geminiClient.generateJsonResponse(systemPrompt, userPrompt)
                                            .flatMap(finalPlan -> {
                                                session.setCurrentStep(TripPlanSession.PlanningStep.FINALIZED);
                                                session.setMasterPlan(finalPlan);
                                                session.setUpdatedAt(LocalDateTime.now());

                                                // Attempt to parse stay and transport from compiled JSON for backend record sync
                                                try {
                                                    com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
                                                    com.fasterxml.jackson.databind.JsonNode root = mapper.readTree(finalPlan);
                                                    
                                                    // Parse first day stay if exists
                                                    com.fasterxml.jackson.databind.JsonNode stayNode = root.at("/itinerary/0/stay");
                                                    if (!stayNode.isMissingNode() && !stayNode.isNull()) {
                                                        TripPlanSession.HotelOption hotel = new TripPlanSession.HotelOption();
                                                        hotel.setName(stayNode.path("name").asText(""));
                                                        hotel.setAddress(stayNode.path("address").asText(""));
                                                        hotel.setCostPerNight(stayNode.path("cost").asText(""));
                                                        session.setSelectedHotel(hotel);
                                                    }
                                                    
                                                    // Find first transit or create transport mode
                                                    com.fasterxml.jackson.databind.JsonNode itinerary = root.path("itinerary");
                                                    if (itinerary.isArray() && !itinerary.isEmpty()) {
                                                        String mode = "Flight"; // fallback
                                                        for (com.fasterxml.jackson.databind.JsonNode dayNode : itinerary) {
                                                            com.fasterxml.jackson.databind.JsonNode activities = dayNode.path("activities");
                                                            if (activities.isArray()) {
                                                                for (com.fasterxml.jackson.databind.JsonNode act : activities) {
                                                                    if (act.path("isTransit").asBoolean(false)) {
                                                                        mode = act.path("type").asText("Flight");
                                                                        break;
                                                                    }
                                                                }
                                                            }
                                                        }
                                                        TripPlanSession.TransportOption trans = new TripPlanSession.TransportOption();
                                                        trans.setMode(mode);
                                                        trans.setCost(root.at("/budgetBreakdown").get(2) != null ? root.at("/budgetBreakdown").get(2).path("cost").asText("") : "");
                                                        trans.setDetails("Selected travel route");
                                                        session.setFinalizedTransportChoice(trans);
                                                    }
                                                } catch (Exception parseEx) {
                                                    log.warn("Non-critical stay/transport extract failed: {}", parseEx.getMessage());
                                                }

                                                return sessionRepository.save(session).map(s -> finalPlan);
                                            })
                                            .switchIfEmpty(Mono.error(new RuntimeException("Failed to generate master plan")));
                                })
                                .orElse(Mono.error(new RuntimeException("Profile not found")))));
    }



    // STAGE 1: BOOKING SUMMARY EXPANSION
    public Mono<String> generateBookingExpansion(String sessionId) {
        return sessionRepository.findById(sessionId)
                .switchIfEmpty(Mono.error(new RuntimeException("Session not found: " + sessionId)))
                .flatMap(session -> {
                    String userPrompt = buildExpansionPrompt(session);
                    return geminiClient.generateJsonResponse(
                            AIPrompts.BOOKING_SUMMARY_EXPANSION_SYSTEM_PROMPT, userPrompt)
                            .map(this::cleanJson);
                });
    }

    private String buildExpansionPrompt(TripPlanSession session) {
        StringBuilder sb = new StringBuilder();
        sb.append("Trip details:\n");
        sb.append("Destination: ").append(session.getDestination()).append("\n");

        if (session.getFinalizedTransportChoice() != null) {
            TripPlanSession.TransportOption t = session.getFinalizedTransportChoice();
            sb.append("Transport mode: ").append(t.getMode())
              .append(", details: ").append(t.getDetails())
              .append(", cost: ").append(t.getCost())
              .append(", duration: ").append(t.getDuration()).append("\n");
        }

        if (session.getSelectedHotel() != null) {
            TripPlanSession.HotelOption h = session.getSelectedHotel();
            sb.append("Hotel: ").append(h.getName())
              .append(", address: ").append(h.getAddress())
              .append(", rate: ").append(h.getCostPerNight()).append("\n");
        }

        if (session.getMasterPlan() != null && !session.getMasterPlan().isBlank()) {
            try {
                com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
                com.fasterxml.jackson.databind.JsonNode plan = mapper.readTree(session.getMasterPlan());
                com.fasterxml.jackson.databind.JsonNode itinerary = plan.at("/itinerary");
                if (itinerary.isArray() && !itinerary.isEmpty()) {
                    String firstDate = itinerary.get(0).at("/date").asText("");
                    String lastDate = itinerary.get(itinerary.size() - 1).at("/date").asText("");
                    if (!firstDate.isEmpty()) {
                        sb.append("Travel dates: ").append(firstDate).append(" to ").append(lastDate).append("\n");
                    }
                }
                String fromCity = plan.at("/itinerary/0/activities/0/from").asText("");
                if (!fromCity.isEmpty()) sb.append("Origin city: ").append(fromCity).append("\n");
            } catch (Exception e) {
                log.debug("Could not parse master plan for expansion prompt");
            }
        }

        sb.append("\nGenerate realistic pre-booking details for the Booking Summary page.");
        return sb.toString();
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
