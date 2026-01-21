package com.tripwise.session;

import com.tripwise.model.TripPlanSession;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;

@Repository
public interface TripPlanSessionRepository extends ReactiveMongoRepository<TripPlanSession, String> {
    Flux<TripPlanSession> findByProfileId(String profileId);
}
