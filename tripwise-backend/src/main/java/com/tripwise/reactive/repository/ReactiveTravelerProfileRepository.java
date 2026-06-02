package com.tripwise.reactive.repository;

import com.tripwise.model.TravelerProfile;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;

@Repository
public interface ReactiveTravelerProfileRepository extends ReactiveMongoRepository<TravelerProfile, String> {
    Mono<TravelerProfile> findByProfileId(String profileId);
    Mono<Boolean> existsByProfileId(String profileId);
    Mono<TravelerProfile> findByBasicInfo_WhatsappNumber(String whatsappNumber);
    Mono<TravelerProfile> findByBasicInfo_Email(String email);
    Mono<Void> deleteByProfileId(String profileId);
}
