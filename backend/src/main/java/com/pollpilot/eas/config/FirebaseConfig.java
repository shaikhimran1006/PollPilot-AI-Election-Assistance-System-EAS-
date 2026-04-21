package com.pollpilot.eas.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import java.io.FileInputStream;
import java.io.IOException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import jakarta.annotation.PostConstruct;

@Configuration
public class FirebaseConfig {
    @Value("${firebase.serviceAccountPath}")
    private String serviceAccountPath;

    @PostConstruct
    public void initialize() throws IOException {
        if (serviceAccountPath == null || serviceAccountPath.isBlank()) {
            return;
        }
        if (FirebaseApp.getApps().isEmpty()) {
            try (FileInputStream stream = new FileInputStream(serviceAccountPath)) {
                FirebaseOptions options = FirebaseOptions.builder()
                        .setCredentials(GoogleCredentials.fromStream(stream))
                        .build();
                FirebaseApp.initializeApp(options);
            }
        }
    }
}
