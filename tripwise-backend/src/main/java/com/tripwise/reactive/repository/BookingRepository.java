package com.tripwise.reactive.repository;

import com.tripwise.model.TripwiseBooking;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;

@Repository
public interface BookingRepository extends ReactiveMongoRepository<TripwiseBooking, String> {
    Mono<TripwiseBooking> findBySessionId(String sessionId);

    Mono<TripwiseBooking> findByShareToken(String shareToken);
}
