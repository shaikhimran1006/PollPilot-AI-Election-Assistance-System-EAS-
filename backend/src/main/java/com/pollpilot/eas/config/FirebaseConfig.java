package com.pollpilot.eas.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import java.io.FileInputStream;
import java.io.IOException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Configuration
public class FirebaseConfig {
    private static final Logger LOGGER = LoggerFactory.getLogger(FirebaseConfig.class);

    @Value("${firebase.serviceAccountPath}")
    private String serviceAccountPath;

    @PostConstruct
    public void initialize() throws IOException {
        if (!FirebaseApp.getApps().isEmpty()) {
            return;
        }

        if (serviceAccountPath == null || serviceAccountPath.isBlank()) {
            try {
                FirebaseOptions options = FirebaseOptions.builder()
                        .setCredentials(GoogleCredentials.getApplicationDefault())
                        .build();
                FirebaseApp.initializeApp(options);
                LOGGER.info("Initialized Firebase with application default credentials");
            } catch (IOException ex) {
                LOGGER.warn("Firebase credentials not configured; Firebase-dependent features will be unavailable");
            }
            return;
        }

        try (FileInputStream stream = new FileInputStream(serviceAccountPath)) {
            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(stream))
                    .build();
            FirebaseApp.initializeApp(options);
            LOGGER.info("Initialized Firebase using service account file");
        }
    }
}
