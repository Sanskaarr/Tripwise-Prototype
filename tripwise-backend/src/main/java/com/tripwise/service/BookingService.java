
package com.tripwise.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tripwise.ai.GeminiClient;
import com.tripwise.config.AIPrompts;
import com.tripwise.dto.BookingPaymentRequest;
import com.tripwise.model.TripPlanSession;
import com.tripwise.model.TripwiseBooking;
import com.tripwise.reactive.repository.BookingRepository;
import com.tripwise.session.TripPlanSessionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.Random;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final TripPlanSessionRepository sessionRepository;
    private final ObjectMapper objectMapper;
    private final GeminiClient geminiClient;
    private final PaymentService paymentService;

    private static final String CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final Random random = new Random();

    public Mono<TripwiseBooking> createBooking(String sessionId, BookingPaymentRequest payment) {
        if (!paymentService.verifySignature(
                payment.getRazorpayOrderId(),
                payment.getRazorpayPaymentId(),
                payment.getRazorpaySignature())) {
            return Mono.error(new RuntimeException("Invalid payment signature"));
        }

        return sessionRepository.findById(sessionId)
                .switchIfEmpty(Mono.error(new RuntimeException("Session not found: " + sessionId)))
                .flatMap(session -> {
                    String userPrompt = buildBookingConfirmationPrompt(session);
                    return geminiClient.generateJsonResponse(
                                    AIPrompts.BOOKING_CONFIRMATION_SYSTEM_PROMPT, userPrompt)
                            .map(geminiJson -> buildBookingFromGemini(session, payment, geminiJson))
                            .onErrorResume(e -> {
                                log.warn("Gemini confirmation failed, using fallback PNRs: {}", e.getMessage());
                                return Mono.just(buildFallbackBooking(session, payment));
                            })
                            .flatMap(bookingRepository::save);
                });
    }

    public Mono<TripwiseBooking> getBooking(String bookingId) {
        return bookingRepository.findById(bookingId)
                .switchIfEmpty(Mono.error(new RuntimeException("Booking not found")));
    }

    public Mono<TripwiseBooking> getBookingByShareToken(String shareToken) {
        return bookingRepository.findByShareToken(shareToken)
                .switchIfEmpty(Mono.error(new RuntimeException("Booking not found")));
    }

    private TripwiseBooking buildBookingFromGemini(TripPlanSession session, BookingPaymentRequest payment, String geminiJson) {
        String destination = session.getDestination() != null ? session.getDestination() : "DEST";
        String totalAmount = extractTotalCost(session.getMasterPlan());
        String transportMode = session.getFinalizedTransportChoice() != null
                ? session.getFinalizedTransportChoice().getMode() : "Flight";
        String hotelName = session.getSelectedHotel() != null ? session.getSelectedHotel().getName() : "";
        String hotelAddress = session.getSelectedHotel() != null ? session.getSelectedHotel().getAddress() : "";

        TripwiseBooking.TripwiseBookingBuilder builder = TripwiseBooking.builder()
                .shareToken(UUID.randomUUID().toString())
                .sessionId(session.getId())
                .profileId(session.getProfileId())
                .destination(destination)
                .hotelName(hotelName)
                .hotelAddress(hotelAddress)
                .transportMode(transportMode)
                .totalAmount(totalAmount)
                .razorpayPaymentId(payment.getRazorpayPaymentId())
                .razorpayOrderId(payment.getRazorpayOrderId())
                .status(TripwiseBooking.BookingStatus.CONFIRMED)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now());

        try {
            JsonNode root = objectMapper.readTree(geminiJson);

            // Arrival transport
            JsonNode at = root.path("arrivalTransport");
            if (!at.isMissingNode()) {
                builder.transportType(at.path("type").asText("FLIGHT"))
                        .airline(at.path("carrier").asText(""))
                        .transportNumber(at.path("number").asText(""))
                        .flightPnr(at.path("pnr").asText(randomPnr()))
                        .fromCity(at.path("fromCity").asText(""))
                        .toCity(at.path("toCity").asText(destination))
                        .transportDate(at.path("departureDate").asText(""))
                        .departureTime(at.path("departureTime").asText(""))
                        .arrivalTime(at.path("arrivalTime").asText(""))
                        .platform(at.path("platform").asText(""))
                        .seatOrCoach(at.path("coach").asText(""))
                        .travelClass(at.path("class").asText("Economy"));
            } else {
                builder.flightPnr(randomPnr());
            }

            // Return transport
            JsonNode rt = root.path("returnTransport");
            if (!rt.isMissingNode()) {
                builder.returnTransportNumber(rt.path("number").asText(""))
                        .returnPnr(rt.path("pnr").asText(randomPnr()))
                        .returnDate(rt.path("departureDate").asText(""))
                        .returnDepartureTime(rt.path("departureTime").asText(""))
                        .returnArrivalTime(rt.path("arrivalTime").asText(""))
                        .returnSeat(rt.path("coach").asText(""));
            }

            // Hotel
            JsonNode ht = root.path("hotel");
            if (!ht.isMissingNode()) {
                String confRef = ht.path("confirmationRef").asText("");
                builder.hotelRef(confRef)
                        .hotelConfirmationRef(confRef)
                        .roomType(ht.path("roomType").asText("Standard Room"))
                        .hotelCheckInTime(ht.path("checkInTime").asText("14:00"))
                        .hotelCheckOutTime(ht.path("checkOutTime").asText("11:00"));
            } else {
                builder.hotelRef(generateHotelRef(hotelName));
            }

            // Local transport
            JsonNode lt = root.path("localTransport");
            if (!lt.isMissingNode()) {
                String ltRef = lt.path("bookingRef").asText(generateLocalRef());
                builder.transportRef(ltRef)
                        .localTransportOperator(lt.path("operator").asText(""))
                        .localTransportBookingRef(ltRef);
            } else {
                builder.transportRef(generateLocalRef());
            }

        } catch (Exception e) {
            log.warn("Failed to parse Gemini booking JSON: {}. Using fallback refs.", e.getMessage());
            applyFallbackRefs(builder, session);
        }

        return builder.build();
    }

    private TripwiseBooking buildFallbackBooking(TripPlanSession session, BookingPaymentRequest payment) {
        String destination = session.getDestination() != null ? session.getDestination() : "DEST";
        String destCode = destination.toUpperCase().replaceAll("[^A-Z]", "");
        destCode = destCode.length() >= 3 ? destCode.substring(0, 3) : destCode;
        String transportMode = session.getFinalizedTransportChoice() != null
                ? session.getFinalizedTransportChoice().getMode() : "Flight";
        String hotelName = session.getSelectedHotel() != null ? session.getSelectedHotel().getName() : "HOTEL";

        return TripwiseBooking.builder()
                .shareToken(UUID.randomUUID().toString())
                .sessionId(session.getId())
                .profileId(session.getProfileId())
                .destination(destination)
                .hotelName(hotelName)
                .hotelAddress(session.getSelectedHotel() != null ? session.getSelectedHotel().getAddress() : "")
                .transportMode(transportMode)
                .totalAmount(extractTotalCost(session.getMasterPlan()))
                .razorpayPaymentId(payment.getRazorpayPaymentId())
                .razorpayOrderId(payment.getRazorpayOrderId())
                .flightPnr(randomPnr())
                .hotelRef(generateHotelRef(hotelName))
                .hotelConfirmationRef(generateHotelRef(hotelName))
                .transportRef(generateLocalRef())
                .localTransportBookingRef(generateLocalRef())
                .status(TripwiseBooking.BookingStatus.CONFIRMED)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    private void applyFallbackRefs(TripwiseBooking.TripwiseBookingBuilder builder, TripPlanSession session) {
        String hotelName = session.getSelectedHotel() != null ? session.getSelectedHotel().getName() : "HOTEL";
        builder.flightPnr(randomPnr())
                .hotelRef(generateHotelRef(hotelName))
                .hotelConfirmationRef(generateHotelRef(hotelName))
                .transportRef(generateLocalRef())
                .localTransportBookingRef(generateLocalRef());
    }

    private String buildBookingConfirmationPrompt(TripPlanSession session) {
        StringBuilder sb = new StringBuilder();
        sb.append("Trip details for booking confirmation:\n");
        sb.append("Destination: ").append(session.getDestination()).append("\n");

        if (session.getFinalizedTransportChoice() != null) {
            TripPlanSession.TransportOption t = session.getFinalizedTransportChoice();
            sb.append("Transport to destination: mode=").append(t.getMode())
                    .append(", details=").append(t.getDetails())
                    .append(", cost=").append(t.getCost())
                    .append(", duration=").append(t.getDuration()).append("\n");
        }

        if (session.getSelectedHotel() != null) {
            TripPlanSession.HotelOption h = session.getSelectedHotel();
            sb.append("Hotel: ").append(h.getName())
                    .append(", address=").append(h.getAddress())
                    .append(", rate=").append(h.getCostPerNight()).append("\n");
        }

        if (session.getMasterPlan() != null && !session.getMasterPlan().isBlank()) {
            try {
                JsonNode plan = objectMapper.readTree(session.getMasterPlan());
                String totalCost = plan.at("/totalCost").asText("");
                if (!totalCost.isEmpty()) sb.append("Total trip cost: ").append(totalCost).append("\n");
                JsonNode itinerary = plan.at("/itinerary");
                if (itinerary.isArray() && !itinerary.isEmpty()) {
                    int numDays = itinerary.size();
                    String firstDate = itinerary.get(0).at("/date").asText("");
                    String lastDate = itinerary.get(numDays - 1).at("/date").asText("");
                    if (!firstDate.isEmpty()) {
                        sb.append("Departure date: ").append(firstDate).append("\n");
                        sb.append("Return date: ").append(lastDate).append("\n");
                    }
                    sb.append("Duration: ").append(numDays).append(" days\n");
                }
            } catch (Exception e) {
                log.debug("Could not parse master plan dates for booking prompt");
            }
        }

        sb.append("\nGenerate realistic booking confirmations matching the transport mode (flight/train/bus). ");
        sb.append("All refs must look authentic. PNRs must be exactly 6 uppercase alphanumeric chars.");
        return sb.toString();
    }

    private String generateHotelRef(String hotelName) {
        String code = hotelName.replaceAll("[^A-Za-z]", "").toUpperCase();
        code = code.length() >= 3 ? code.substring(0, 3) : (code.length() > 0 ? code : "HTL");
        return code + "-" + (1000 + random.nextInt(8999));
    }

    private String generateLocalRef() {
        return "GT-" + (2024 + random.nextInt(2)) + "-" + (100 + random.nextInt(899));
    }

    private String randomPnr() {
        StringBuilder sb = new StringBuilder(6);
        for (int i = 0; i < 6; i++) sb.append(CHARS.charAt(random.nextInt(CHARS.length())));
        return sb.toString();
    }

    private String extractTotalCost(String masterPlanJson) {
        if (masterPlanJson == null || masterPlanJson.isBlank()) return "₹0";
        try {
            JsonNode node = objectMapper.readTree(masterPlanJson);
            String total = node.at("/totalCost").asText("");
            return total.isEmpty() ? "₹0" : total;
        } catch (Exception e) {
            return "₹0";
        }
    }
}
