package com.pollpilot.eas.service;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import com.pollpilot.eas.model.NotificationPreference;
import com.pollpilot.eas.repository.NotificationPreferenceRepository;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {
    private final NotificationPreferenceRepository notificationPreferenceRepository;

    public NotificationService(NotificationPreferenceRepository notificationPreferenceRepository) {
        this.notificationPreferenceRepository = notificationPreferenceRepository;
    }

    public NotificationPreference upsertPreference(String userId, String fcmToken, boolean enabled) {
        NotificationPreference preference = notificationPreferenceRepository.findByUserId(userId)
                .orElseGet(NotificationPreference::new);
        preference.setUserId(userId);
        preference.setFcmToken(fcmToken);
        preference.setRemindersEnabled(enabled);
        return notificationPreferenceRepository.save(preference);
    }

    public void sendReminder(NotificationPreference preference, String title, String body) throws Exception {
        if (!preference.isRemindersEnabled()) {
            return;
        }
        Message message = Message.builder()
                .setToken(preference.getFcmToken())
                .putData("title", title)
                .putData("body", body)
                .build();
        FirebaseMessaging.getInstance().send(message);
    }
}
