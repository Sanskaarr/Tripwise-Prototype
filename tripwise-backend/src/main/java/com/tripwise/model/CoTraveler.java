package com.tripwise.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "co_travelers")
public class CoTraveler {

    @Id
    private String id;

    @Field("profileId")
    private String profileId;

    @Field("name")
    private String name;

    @Field("relation")
    private String relation;

    @Field("ageGroup")
    private String ageGroup; // Adult, Child, Infant

    @Field("preferences")
    private List<String> preferences; // e.g. "Vegetarian", "Window Seat"
}
