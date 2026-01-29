package com.tripwise.controller;

import com.tripwise.model.CoTraveler;
import com.tripwise.reactive.repository.CoTravelerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/cotravelers")
@RequiredArgsConstructor
public class CoTravelerController {

    private final CoTravelerRepository coTravelerRepository;

    @GetMapping("/profile/{profileId}")
    public Flux<CoTraveler> getCoTravelers(@PathVariable String profileId) {
        return coTravelerRepository.findByProfileId(profileId);
    }

    @PostMapping
    public Mono<CoTraveler> addCoTraveler(@RequestBody CoTraveler coTraveler) {
        return coTravelerRepository.save(coTraveler);
    }

    @PutMapping("/{id}")
    public Mono<CoTraveler> updateCoTraveler(@PathVariable String id, @RequestBody CoTraveler coTraveler) {
        return coTravelerRepository.findById(id)
                .flatMap(existing -> {
                    existing.setName(coTraveler.getName());
                    existing.setRelation(coTraveler.getRelation());
                    existing.setAgeGroup(coTraveler.getAgeGroup());
                    existing.setPreferences(coTraveler.getPreferences());
                    return coTravelerRepository.save(existing);
                });
    }

    @DeleteMapping("/{id}")
    public Mono<Void> deleteCoTraveler(@PathVariable String id) {
        return coTravelerRepository.deleteById(id);
    }
}
