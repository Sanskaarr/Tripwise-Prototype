package com.tripwise.reactive.repository;

import com.tripwise.model.CoTraveler;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;

@Repository
public interface ReactiveCoTravelerRepository extends ReactiveMongoRepository<CoTraveler, String> {
    Flux<CoTraveler> findByProfileId(String profileId);
}
