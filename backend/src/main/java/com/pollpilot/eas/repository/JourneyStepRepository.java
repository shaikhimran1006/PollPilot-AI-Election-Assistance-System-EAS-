package com.pollpilot.eas.repository;

import com.pollpilot.eas.model.JourneyStep;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JourneyStepRepository extends JpaRepository<JourneyStep, String> {
    List<JourneyStep> findByUserIdOrderByStepOrder(String userId);
}
