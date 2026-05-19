package com.tripwise.controller;

import com.tripwise.ai.GeminiClient;
import com.tripwise.dto.ChatRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final GeminiClient geminiClient;

    @PostMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<ServerSentEvent<String>> streamChat(@RequestBody ChatRequest request) {
        return geminiClient.streamChatResponse(request)
                .map(content -> ServerSentEvent.<String>builder()
                        .data(content)
                        .build());
    }
}
