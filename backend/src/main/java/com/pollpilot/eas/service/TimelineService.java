package com.pollpilot.eas.service;

import com.pollpilot.eas.dto.TimelineRequest;
import com.pollpilot.eas.model.TimelineEvent;
import com.pollpilot.eas.repository.TimelineEventRepository;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class TimelineService {
    private final TimelineEventRepository timelineEventRepository;

    public TimelineService(TimelineEventRepository timelineEventRepository) {
        this.timelineEventRepository = timelineEventRepository;
    }

    public List<TimelineEvent> getTimeline(String userId) {
        List<TimelineEvent> existing = timelineEventRepository.findByUserIdOrderByEventTime(userId);
        if (!existing.isEmpty()) {
            return existing;
        }
        Instant now = Instant.now();
        List<TimelineEvent> seeded = new ArrayList<>();
        seeded.add(createEvent(userId, "Registration window closes", "Complete any pending registration updates.",
                "deadline", now.plus(7, ChronoUnit.DAYS)));
        seeded.add(createEvent(userId, "Document verification reminder", "Carry approved ID and voter slip.",
                "reminder", now.plus(12, ChronoUnit.DAYS)));
        seeded.add(createEvent(userId, "Election day", "Reach polling booth during your preferred time slot.",
                "election", now.plus(18, ChronoUnit.DAYS)));
        timelineEventRepository.saveAll(seeded);
        return timelineEventRepository.findByUserIdOrderByEventTime(userId);
    }

    public TimelineEvent addEvent(String userId, TimelineRequest request) {
        TimelineEvent event = new TimelineEvent();
        event.setUserId(userId);
        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setCategory(request.getCategory());
        event.setEventTime(request.getEventTime());
        return timelineEventRepository.save(event);
    }

    private TimelineEvent createEvent(String userId, String title, String description, String category,
            Instant eventTime) {
        TimelineEvent event = new TimelineEvent();
        event.setUserId(userId);
        event.setTitle(title);
        event.setDescription(description);
        event.setCategory(category);
        event.setEventTime(eventTime);
        return event;
    }
}
