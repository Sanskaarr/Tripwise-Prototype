package com.tripwise.controller;

import com.tripwise.model.CoTraveler;
import com.tripwise.reactive.repository.ReactiveCoTravelerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/cotravelers")
@RequiredArgsConstructor
public class CoTravelerController {

    private final ReactiveCoTravelerRepository coTravelerRepository;

    @GetMapping("/profile/{profileId}")
    public Flux<CoTraveler> getCoTravelers(@PathVariable String profileId) {
        return coTravelerRepository.findByProfileId(profileId);
    }

    @PostMapping
    public Mono<ResponseEntity<CoTraveler>> addCoTraveler(@RequestBody CoTraveler coTraveler) {
        return coTravelerRepository.save(coTraveler).map(ResponseEntity::ok);
    }

    @PutMapping("/{id}")
    public Mono<ResponseEntity<CoTraveler>> updateCoTraveler(@PathVariable String id, @RequestBody CoTraveler coTraveler) {
        return coTravelerRepository.findById(id)
            .flatMap(existing -> {
                existing.setName(coTraveler.getName());
                existing.setRelation(coTraveler.getRelation());
                existing.setAgeGroup(coTraveler.getAgeGroup());
                existing.setPreferences(coTraveler.getPreferences());
                return coTravelerRepository.save(existing);
            })
            .map(ResponseEntity::ok)
            .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public Mono<ResponseEntity<Void>> deleteCoTraveler(@PathVariable String id) {
        return coTravelerRepository.deleteById(id)
            .then(Mono.just(ResponseEntity.noContent().<Void>build()));
    }
}
