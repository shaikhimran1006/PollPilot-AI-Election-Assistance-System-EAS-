package com.pollpilot.eas.controller;

import com.pollpilot.eas.dto.FakeNewsRequest;
import com.pollpilot.eas.model.FakeNewsCheck;
import com.pollpilot.eas.service.CurrentUserService;
import com.pollpilot.eas.service.FakeNewsService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/news")
public class FakeNewsController {
    private final FakeNewsService fakeNewsService;
    private final CurrentUserService currentUserService;

    public FakeNewsController(FakeNewsService fakeNewsService, CurrentUserService currentUserService) {
        this.fakeNewsService = fakeNewsService;
        this.currentUserService = currentUserService;
    }

    @PostMapping("/check")
    public ResponseEntity<FakeNewsCheck> check(@Valid @RequestBody FakeNewsRequest request) {
        return ResponseEntity.ok(fakeNewsService.analyze(currentUserService.getUserId(), request.getContent()));
    }
}
