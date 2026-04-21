package com.pollpilot.eas.dto;

import jakarta.validation.constraints.NotBlank;

public class NotificationRequest {
    @NotBlank
    private String fcmToken;

    private boolean remindersEnabled;

    public String getFcmToken() {
        return fcmToken;
    }

    public void setFcmToken(String fcmToken) {
        this.fcmToken = fcmToken;
    }

    public boolean isRemindersEnabled() {
        return remindersEnabled;
    }

    public void setRemindersEnabled(boolean remindersEnabled) {
        this.remindersEnabled = remindersEnabled;
    }
}
