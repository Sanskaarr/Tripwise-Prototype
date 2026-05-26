package com.tripwise.repository;

import com.tripwise.model.CoTraveler;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CoTravelerRepository extends MongoRepository<CoTraveler, String> {
    List<CoTraveler> findByProfileId(String profileId);
}
