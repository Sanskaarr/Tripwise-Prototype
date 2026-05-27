
package com.tripwise.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tripwise.ai.GeminiClient;
import com.tripwise.config.AIPrompts;
import com.tripwise.dto.BookingPaymentRequest;
import com.tripwise.model.Trip;
import com.tripwise.model.TripPlanSession;
import com.tripwise.model.TripwiseBooking;
import com.tripwise.reactive.repository.BookingRepository;
import com.tripwise.reactive.repository.ReactiveTripRepository;
import com.tripwise.session.TripPlanSessionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.Random;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ReactiveTripRepository reactiveTripRepository;
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
                            .flatMap(bookingRepository::save)
                            .flatMap(savedBooking -> reactiveTripRepository.save(buildTripFromBooking(savedBooking))
                                    .doOnError(e -> log.error("Failed to save trip record: {}", e.getMessage()))
                                    .onErrorResume(e -> reactor.core.publisher.Mono.empty())
                                    .thenReturn(savedBooking));
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

    private Trip buildTripFromBooking(TripwiseBooking booking) {
        String startDate = booking.getTransportDate() != null ? booking.getTransportDate() : "";
        String endDate = booking.getReturnDate() != null ? booking.getReturnDate() : "";
        String bookingRef = "TW-" + (1000 + random.nextInt(8999));

        BigDecimal cost = null;
        try {
            String raw = booking.getTotalAmount();
            if (raw != null && !raw.isBlank()) {
                cost = new BigDecimal(raw.replaceAll("[^\\d.]", ""));
            }
        } catch (Exception ignored) {}

        return Trip.builder()
                .profileId(booking.getProfileId())
                .destination(booking.getDestination())
                .startDate(startDate)
                .endDate(endDate)
                .dates(formatDateRange(startDate, endDate))
                .status("upcoming")
                .bookingReference(bookingRef)
                .estimatedCost(cost)
                .currency("INR")
                .passShareToken(booking.getShareToken())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    private String formatDateRange(String start, String end) {
        DateTimeFormatter[] parsers = {
            DateTimeFormatter.ofPattern("yyyy-MM-dd"),
            DateTimeFormatter.ofPattern("dd MMM yyyy"),
            DateTimeFormatter.ofPattern("MMM dd, yyyy")
        };
        DateTimeFormatter display = DateTimeFormatter.ofPattern("MMM d, yyyy");
        String formattedStart = start, formattedEnd = end;
        for (DateTimeFormatter fmt : parsers) {
            try { formattedStart = LocalDate.parse(start, fmt).format(display); break; }
            catch (DateTimeParseException ignored) {}
        }
        for (DateTimeFormatter fmt : parsers) {
            try { formattedEnd = LocalDate.parse(end, fmt).format(display); break; }
            catch (DateTimeParseException ignored) {}
        }
        if (formattedStart.isBlank() && formattedEnd.isBlank()) return "";
        if (formattedEnd.isBlank()) return formattedStart;
        return formattedStart + " - " + formattedEnd;
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
                    if (!firstDate.isEmpty()) {
                        sb.append("Departure date: ").append(firstDate).append(" (use this EXACT date in arrivalTransport.departureDate)\n");
                    }
                    sb.append("Duration: ").append(numDays).append(" days\n");
                }
                // Extract origin city from first transit activity if available
                outer:
                for (JsonNode dayNode : itinerary) {
                    for (JsonNode act : dayNode.path("activities")) {
                        if (act.path("isTransit").asBoolean(false)) {
                            String from = act.path("from").asText("");
                            if (!from.isEmpty()) { sb.append("Origin city: ").append(from).append("\n"); break outer; }
                        }
                    }
                }
            } catch (Exception e) {
                log.debug("Could not parse master plan dates for booking prompt");
            }
        }

        sb.append("\nDo NOT include returnTransport in the response.");
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
