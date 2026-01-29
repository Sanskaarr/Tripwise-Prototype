package com.tripwise.controller;

import com.tripwise.model.TravelDocument;
import com.tripwise.reactive.repository.TravelDocumentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/documents")
@RequiredArgsConstructor
public class TravelDocumentController {

    private final TravelDocumentRepository documentRepository;

    @GetMapping("/profile/{profileId}")
    public Flux<TravelDocument> getDocuments(@PathVariable String profileId) {
        return documentRepository.findByProfileId(profileId);
    }

    @PostMapping
    public Mono<TravelDocument> addDocument(@RequestBody TravelDocument document) {
        return documentRepository.save(document);
    }

    @DeleteMapping("/{id}")
    public Mono<Void> deleteDocument(@PathVariable String id) {
        return documentRepository.deleteById(id);
    }
}
