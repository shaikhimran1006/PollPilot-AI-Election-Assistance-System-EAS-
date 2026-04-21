package com.pollpilot.eas.service;

import com.pollpilot.eas.dto.TimelineRequest;
import com.pollpilot.eas.model.TimelineEvent;
import com.pollpilot.eas.repository.TimelineEventRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class TimelineService {
    private final TimelineEventRepository timelineEventRepository;

    public TimelineService(TimelineEventRepository timelineEventRepository) {
        this.timelineEventRepository = timelineEventRepository;
    }

    public List<TimelineEvent> getTimeline(String userId) {
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
}
