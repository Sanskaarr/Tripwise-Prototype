package com.tripwise.repository;

import com.tripwise.model.TravelerProfile;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TravelerProfileRepository extends MongoRepository<TravelerProfile, String> {

    Optional<TravelerProfile> findByProfileId(String profileId);

    boolean existsByProfileId(String profileId);

    void deleteByProfileId(String profileId);
}
