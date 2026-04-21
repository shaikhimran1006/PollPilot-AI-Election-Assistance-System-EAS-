package com.pollpilot.eas.controller;

import com.pollpilot.eas.dto.NotificationRequest;
import com.pollpilot.eas.model.NotificationPreference;
import com.pollpilot.eas.service.CurrentUserService;
import com.pollpilot.eas.service.NotificationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
    private final NotificationService notificationService;
    private final CurrentUserService currentUserService;

    public NotificationController(NotificationService notificationService, CurrentUserService currentUserService) {
        this.notificationService = notificationService;
        this.currentUserService = currentUserService;
    }

    @PostMapping("/preferences")
    public ResponseEntity<NotificationPreference> updatePreference(@Valid @RequestBody NotificationRequest request) {
        return ResponseEntity.ok(notificationService.upsertPreference(
                currentUserService.getUserId(), request.getFcmToken(), request.isRemindersEnabled()));
    }
}
