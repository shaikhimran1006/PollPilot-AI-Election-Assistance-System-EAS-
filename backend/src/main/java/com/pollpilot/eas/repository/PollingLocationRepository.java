package com.pollpilot.eas.repository;

import com.pollpilot.eas.model.PollingLocation;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PollingLocationRepository extends JpaRepository<PollingLocation, String> {
    List<PollingLocation> findByUserId(String userId);
}
