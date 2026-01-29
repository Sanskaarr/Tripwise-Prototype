package com.tripwise.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "travel_documents")
public class TravelDocument {

    @Id
    private String id;

    @Field("profileId")
    private String profileId;

    @Field("type")
    private String type; // Passport, Visa, Ticket, Insurance

    @Field("documentNumber")
    private String documentNumber;

    @Field("expiryDate")
    private String expiryDate; // ISO Date String

    @Field("fileUrl")
    private String fileUrl; // URL to stored file
}
