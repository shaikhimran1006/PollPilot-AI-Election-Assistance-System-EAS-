package com.pollpilot.eas.controller;

import com.pollpilot.eas.dto.TimelineRequest;
import com.pollpilot.eas.model.TimelineEvent;
import com.pollpilot.eas.service.CurrentUserService;
import com.pollpilot.eas.service.TimelineService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/timeline")
public class TimelineController {
    private final TimelineService timelineService;
    private final CurrentUserService currentUserService;

    public TimelineController(TimelineService timelineService, CurrentUserService currentUserService) {
        this.timelineService = timelineService;
        this.currentUserService = currentUserService;
    }

    @GetMapping
    public ResponseEntity<List<TimelineEvent>> getTimeline() {
        return ResponseEntity.ok(timelineService.getTimeline(currentUserService.getUserId()));
    }

    @PostMapping
    public ResponseEntity<TimelineEvent> addEvent(@Valid @RequestBody TimelineRequest request) {
        return ResponseEntity.ok(timelineService.addEvent(currentUserService.getUserId(), request));
    }
}
