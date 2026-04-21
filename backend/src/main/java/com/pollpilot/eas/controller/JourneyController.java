package com.pollpilot.eas.controller;

import com.pollpilot.eas.dto.JourneyUpdateRequest;
import com.pollpilot.eas.model.JourneyStep;
import com.pollpilot.eas.service.CurrentUserService;
import com.pollpilot.eas.service.JourneyService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/journey")
public class JourneyController {
    private final JourneyService journeyService;
    private final CurrentUserService currentUserService;

    public JourneyController(JourneyService journeyService, CurrentUserService currentUserService) {
        this.journeyService = journeyService;
        this.currentUserService = currentUserService;
    }

    @GetMapping
    public ResponseEntity<List<JourneyStep>> getSteps() {
        return ResponseEntity.ok(journeyService.getSteps(currentUserService.getUserId()));
    }

    @PatchMapping
    public ResponseEntity<JourneyStep> update(@Valid @RequestBody JourneyUpdateRequest request) {
        return ResponseEntity.ok(journeyService.updateStep(currentUserService.getUserId(), request));
    }
}
