package com.tripwise.controller;

import com.tripwise.model.Trip;
import com.tripwise.repository.TripRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/trips")
@RequiredArgsConstructor
public class TripController {

    private final TripRepository tripRepository;

    @GetMapping("/user/{profileId}")
    public ResponseEntity<List<Trip>> getUserTrips(@PathVariable String profileId) {
        return ResponseEntity.ok(tripRepository.findByProfileId(profileId));
    }

    @PostMapping("/create")
    public ResponseEntity<Trip> createTrip(@RequestBody Trip trip) {
        if (trip.getId() == null) {
            trip.setCreatedAt(LocalDateTime.now());
        }
        trip.setUpdatedAt(LocalDateTime.now());

        // Generate booking reference if not present
        if (trip.getBookingReference() == null) {
            trip.setBookingReference("TW-" + UUID.randomUUID().toString().substring(0, 4).toUpperCase());
        }

        Trip savedTrip = tripRepository.save(trip);
        return ResponseEntity.ok(savedTrip);
    }
}
