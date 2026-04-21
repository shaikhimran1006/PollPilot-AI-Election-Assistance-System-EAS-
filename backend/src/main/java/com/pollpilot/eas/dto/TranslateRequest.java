package com.pollpilot.eas.dto;

import jakarta.validation.constraints.NotBlank;

public class TranslateRequest {
    @NotBlank
    private String text;

    @NotBlank
    private String targetLanguage;

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getTargetLanguage() {
        return targetLanguage;
    }

    public void setTargetLanguage(String targetLanguage) {
        this.targetLanguage = targetLanguage;
    }
}
