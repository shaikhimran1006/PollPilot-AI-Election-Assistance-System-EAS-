package com.pollpilot.eas.service;

import com.pollpilot.eas.dto.JourneyUpdateRequest;
import com.pollpilot.eas.model.JourneyStep;
import com.pollpilot.eas.repository.JourneyStepRepository;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class JourneyService {
    private final JourneyStepRepository journeyStepRepository;
    private final FirestoreService firestoreService;

    public JourneyService(JourneyStepRepository journeyStepRepository, FirestoreService firestoreService) {
        this.journeyStepRepository = journeyStepRepository;
        this.firestoreService = firestoreService;
    }

    public List<JourneyStep> getSteps(String userId) {
        List<JourneyStep> existing = journeyStepRepository.findByUserIdOrderByStepOrder(userId);
        if (!existing.isEmpty()) {
            return existing;
        }
        List<JourneyStep> seeded = new ArrayList<>();
        seeded.add(createStep(userId, 1, "Confirm registration", "Verify your voter registration status online."));
        seeded.add(createStep(userId, 2, "Verify identity documents", "Keep ID proof and address proof ready for election day."));
        seeded.add(createStep(userId, 3, "Locate polling booth", "Find and save the nearest polling station with directions."));
        seeded.add(createStep(userId, 4, "Plan election day", "Set reminders for date, time, and travel to the booth."));
        journeyStepRepository.saveAll(seeded);
        return journeyStepRepository.findByUserIdOrderByStepOrder(userId);
    }

    private JourneyStep createStep(String userId, int stepOrder, String title, String description) {
        JourneyStep step = new JourneyStep();
        step.setUserId(userId);
        step.setStepOrder(stepOrder);
        step.setTitle(title);
        step.setDescription(description);
        step.setStatus("pending");
        step.setUpdatedAt(Instant.now());
        return step;
    }

    public JourneyStep updateStep(String userId, JourneyUpdateRequest request) {
        JourneyStep step = journeyStepRepository.findById(request.getStepId())
                .orElseThrow(() -> new IllegalArgumentException("Step not found"));
        if (!step.getUserId().equals(userId)) {
            throw new IllegalArgumentException("Unauthorized");
        }
        step.setStatus(request.getStatus());
        step.setStepOrder(request.getStepOrder());
        step.setUpdatedAt(Instant.now());
        JourneyStep saved = journeyStepRepository.save(step);
        firestoreService.upsertUserProgress(userId, java.util.Map.of(
                "stepId", saved.getId(),
                "status", saved.getStatus(),
                "stepOrder", saved.getStepOrder(),
                "updatedAt", saved.getUpdatedAt().toString()));
        return saved;
    }
}
