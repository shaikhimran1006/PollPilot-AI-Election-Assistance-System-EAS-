package com.pollpilot.eas.service;

import com.pollpilot.eas.dto.JourneyUpdateRequest;
import com.pollpilot.eas.model.JourneyStep;
import com.pollpilot.eas.repository.JourneyStepRepository;
import java.time.Instant;
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
        return journeyStepRepository.findByUserIdOrderByStepOrder(userId);
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
