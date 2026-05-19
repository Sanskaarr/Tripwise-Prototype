package com.tripwise.controller;

import com.tripwise.dto.BookingPaymentRequest;
import com.tripwise.model.TripwiseBooking;
import com.tripwise.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/booking")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping("/{sessionId}/create")
    public Mono<ResponseEntity<TripwiseBooking>> createBooking(
            @PathVariable String sessionId,
            @RequestBody BookingPaymentRequest paymentRequest) {
        return bookingService.createBooking(sessionId, paymentRequest)
                .map(ResponseEntity::ok)
                .onErrorResume(e -> Mono.just(ResponseEntity.badRequest().build()));
    }

    // Public endpoint — uses a cryptographically random shareToken, not the MongoDB _id.
    @GetMapping("/{shareToken}")
    public Mono<ResponseEntity<TripwiseBooking>> getBooking(@PathVariable String shareToken) {
        return bookingService.getBookingByShareToken(shareToken)
                .map(ResponseEntity::ok)
                .onErrorResume(e -> Mono.just(ResponseEntity.notFound().build()));
    }
}
