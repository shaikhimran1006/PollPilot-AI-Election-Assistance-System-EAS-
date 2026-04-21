package com.pollpilot.eas.repository;

import com.pollpilot.eas.model.TimelineEvent;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TimelineEventRepository extends JpaRepository<TimelineEvent, String> {
    List<TimelineEvent> findByUserIdOrderByEventTime(String userId);
}
