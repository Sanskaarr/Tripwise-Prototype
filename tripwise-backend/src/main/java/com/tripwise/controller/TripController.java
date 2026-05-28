package com.tripwise.controller;

import com.tripwise.model.Trip;
import com.tripwise.repository.TripRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    private final TripRepository tripRepository;

    private static final DateTimeFormatter[] DATE_PARSERS = {
        DateTimeFormatter.ofPattern("yyyy-MM-dd"),
        DateTimeFormatter.ofPattern("MMM d, yyyy"),
        DateTimeFormatter.ofPattern("dd MMM yyyy"),
        DateTimeFormatter.ofPattern("MMM dd, yyyy"),
    };

    @GetMapping("/user/{profileId}")
    public ResponseEntity<List<Trip>> getUserTrips(@PathVariable String profileId) {
        List<Trip> trips = tripRepository.findByProfileId(profileId);
        LocalDate today = LocalDate.now();

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
            tripRepository.saveAll(toSave);
        }

        return ResponseEntity.ok(trips);
    }

    @PutMapping("/{tripId}/cancel")
    public ResponseEntity<Trip> cancelTrip(@PathVariable String tripId) {
        return tripRepository.findById(tripId)
                .map(trip -> {
                    trip.setStatus("cancelled");
                    trip.setUpdatedAt(LocalDateTime.now());
                    return ResponseEntity.ok(tripRepository.save(trip));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/create")
    public ResponseEntity<Trip> createTrip(@RequestBody Trip trip) {
        if (trip.getId() == null) {
            trip.setCreatedAt(LocalDateTime.now());
        }
        trip.setUpdatedAt(LocalDateTime.now());

        if (trip.getBookingReference() == null) {
            trip.setBookingReference("TW-" + UUID.randomUUID().toString().substring(0, 4).toUpperCase());
        }

        Trip savedTrip = tripRepository.save(trip);
        return ResponseEntity.ok(savedTrip);
    }
}
