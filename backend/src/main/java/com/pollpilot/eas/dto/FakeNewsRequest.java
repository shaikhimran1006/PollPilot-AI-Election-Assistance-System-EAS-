package com.pollpilot.eas.dto;

import jakarta.validation.constraints.NotBlank;

public class FakeNewsRequest {
    @NotBlank
    private String content;

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
