package com.pollpilot.eas.repository;

import com.pollpilot.eas.model.NotificationPreference;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationPreferenceRepository extends JpaRepository<NotificationPreference, String> {
    Optional<NotificationPreference> findByUserId(String userId);
}
