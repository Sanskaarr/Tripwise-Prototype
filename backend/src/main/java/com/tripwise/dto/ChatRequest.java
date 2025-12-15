package com.tripwise.dto;

import lombok.Data;

@Data
public class ChatRequest {
    private String text;
    private String language;
}
