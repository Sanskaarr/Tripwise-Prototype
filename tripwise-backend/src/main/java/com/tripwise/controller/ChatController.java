package com.tripwise.controller;

import com.tripwise.ai.GeminiClient;
import com.tripwise.dto.ChatRequest;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private static final Logger logger = LoggerFactory.getLogger(ChatController.class);
    private final GeminiClient geminiClient;

    @PostMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<ServerSentEvent<String>> streamChat(@RequestBody ChatRequest request) {
        logger.info("POST /api/chat/stream → destination={} | messages={} | hasContext={}",
                request.getDestination(),
                request.getMessages() != null ? request.getMessages().size() : 0,
                request.getProfileContext() != null && !request.getProfileContext().isEmpty());

        return geminiClient.streamChatResponse(request)
                .map(content -> ServerSentEvent.<String>builder()
                        .data(content)
                        .build());
    }
}
