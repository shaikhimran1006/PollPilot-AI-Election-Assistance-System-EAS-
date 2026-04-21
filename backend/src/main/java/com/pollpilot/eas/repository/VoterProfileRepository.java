package com.pollpilot.eas.repository;

import com.pollpilot.eas.model.VoterProfile;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VoterProfileRepository extends JpaRepository<VoterProfile, String> {
    Optional<VoterProfile> findByUserId(String userId);
}
