package com.pollpilot.eas.repository;

import com.pollpilot.eas.model.DocumentChecklistItem;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DocumentChecklistRepository extends JpaRepository<DocumentChecklistItem, String> {
    List<DocumentChecklistItem> findByUserId(String userId);
}
