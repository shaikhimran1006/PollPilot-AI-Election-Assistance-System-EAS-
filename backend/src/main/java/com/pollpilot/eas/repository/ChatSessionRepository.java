package com.pollpilot.eas.repository;

import com.pollpilot.eas.model.ChatSession;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatSessionRepository extends JpaRepository<ChatSession, String> {
    Optional<ChatSession> findByUserId(String userId);
}
