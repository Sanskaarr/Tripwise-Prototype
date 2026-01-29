package com.tripwise.repository;

import com.tripwise.model.Trip;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface TripRepository extends MongoRepository<Trip, String> {
    List<Trip> findByProfileId(String profileId);

    List<Trip> findByProfileIdAndStatus(String profileId, String status);
}
