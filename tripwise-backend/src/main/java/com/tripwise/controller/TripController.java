package com.tripwise.controller;

import com.tripwise.model.Trip;
import com.tripwise.reactive.repository.ReactiveTripRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/trips")
@RequiredArgsConstructor
public class TripController {

    private final ReactiveTripRepository tripRepository;

    private static final DateTimeFormatter[] DATE_PARSERS = {
        DateTimeFormatter.ofPattern("yyyy-MM-dd"),
        DateTimeFormatter.ofPattern("MMM d, yyyy"),
        DateTimeFormatter.ofPattern("dd MMM yyyy"),
        DateTimeFormatter.ofPattern("MMM dd, yyyy"),
    };

    @GetMapping("/user/{profileId}")
    public Mono<ResponseEntity<List<Trip>>> getUserTrips(@PathVariable String profileId) {
        LocalDate today = LocalDate.now();
        return tripRepository.findByProfileId(profileId)
            .collectList()
            .flatMap(trips -> {
                List<Trip> toSave = new ArrayList<>();
                for (Trip trip : trips) {
                    if ("cancelled".equals(trip.getStatus())) continue;
                    if (trip.getEndDate() == null || trip.getEndDate().isBlank()) continue;
                    for (DateTimeFormatter fmt : DATE_PARSERS) {
                        try {
                            LocalDate end = LocalDate.parse(trip.getEndDate(), fmt);
                            if (end.isBefore(today)) {
                                trip.setStatus("completed");
                                trip.setUpdatedAt(LocalDateTime.now());
                                toSave.add(trip);
                            }
                            break;
                        } catch (DateTimeParseException ignored) {}
                    }
                }
                if (!toSave.isEmpty()) {
                    return tripRepository.saveAll(toSave).then(Mono.just(ResponseEntity.ok(trips)));
                }
                return Mono.just(ResponseEntity.ok(trips));
            });
    }

    @PutMapping("/{tripId}/cancel")
    public Mono<ResponseEntity<Trip>> cancelTrip(@PathVariable String tripId) {
        return tripRepository.findById(tripId)
            .flatMap(trip -> {
                trip.setStatus("cancelled");
                trip.setUpdatedAt(LocalDateTime.now());
                return tripRepository.save(trip);
            })
            .map(ResponseEntity::ok)
            .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @PostMapping("/create")
    public Mono<ResponseEntity<Trip>> createTrip(@RequestBody Trip trip) {
        if (trip.getId() == null) {
            trip.setCreatedAt(LocalDateTime.now());
        }
        trip.setUpdatedAt(LocalDateTime.now());
        if (trip.getBookingReference() == null) {
            trip.setBookingReference("TW-" + UUID.randomUUID().toString().substring(0, 4).toUpperCase());
        }
        return tripRepository.save(trip).map(ResponseEntity::ok);
    }
}
