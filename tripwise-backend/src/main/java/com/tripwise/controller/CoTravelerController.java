package com.tripwise.controller;

import com.tripwise.model.CoTraveler;
import com.tripwise.repository.CoTravelerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cotravelers")
@RequiredArgsConstructor
public class CoTravelerController {

    private final CoTravelerRepository coTravelerRepository;

    @GetMapping("/profile/{profileId}")
    public ResponseEntity<List<CoTraveler>> getCoTravelers(@PathVariable String profileId) {
        return ResponseEntity.ok(coTravelerRepository.findByProfileId(profileId));
    }

    @PostMapping
    public ResponseEntity<CoTraveler> addCoTraveler(@RequestBody CoTraveler coTraveler) {
        return ResponseEntity.ok(coTravelerRepository.save(coTraveler));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CoTraveler> updateCoTraveler(@PathVariable String id, @RequestBody CoTraveler coTraveler) {
        return coTravelerRepository.findById(id)
                .map(existing -> {
                    existing.setName(coTraveler.getName());
                    existing.setRelation(coTraveler.getRelation());
                    existing.setAgeGroup(coTraveler.getAgeGroup());
                    existing.setPreferences(coTraveler.getPreferences());
                    return ResponseEntity.ok(coTravelerRepository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCoTraveler(@PathVariable String id) {
        coTravelerRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
