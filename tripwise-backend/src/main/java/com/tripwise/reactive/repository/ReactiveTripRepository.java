package com.tripwise.reactive.repository;

import com.tripwise.model.Trip;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;

@Repository
public interface ReactiveTripRepository extends ReactiveMongoRepository<Trip, String> {
    Flux<Trip> findByProfileId(String profileId);
}
