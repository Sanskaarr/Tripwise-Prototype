package com.tripwise.reactive.repository;

import com.tripwise.model.TravelDocument;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;

@Repository
public interface TravelDocumentRepository extends ReactiveMongoRepository<TravelDocument, String> {
    Flux<TravelDocument> findByProfileId(String profileId);
}
