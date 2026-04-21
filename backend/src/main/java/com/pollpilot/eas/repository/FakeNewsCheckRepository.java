package com.pollpilot.eas.repository;

import com.pollpilot.eas.model.FakeNewsCheck;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FakeNewsCheckRepository extends JpaRepository<FakeNewsCheck, String> {
    List<FakeNewsCheck> findByUserIdOrderByCreatedAtDesc(String userId);
}
