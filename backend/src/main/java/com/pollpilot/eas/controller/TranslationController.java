package com.pollpilot.eas.controller;

import com.pollpilot.eas.dto.TranslateRequest;
import com.pollpilot.eas.service.TranslationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/translate")
public class TranslationController {
    private final TranslationService translationService;

    public TranslationController(TranslationService translationService) {
        this.translationService = translationService;
    }

    @PostMapping
    public ResponseEntity<String> translate(@Valid @RequestBody TranslateRequest request) {
        return ResponseEntity.ok(translationService.translate(request.getText(), request.getTargetLanguage()));
    }
}
