package com.pollpilot.eas.service;

import com.pollpilot.eas.model.FakeNewsCheck;
import com.pollpilot.eas.repository.FakeNewsCheckRepository;
import org.springframework.stereotype.Service;

@Service
public class FakeNewsService {
    private final FakeNewsCheckRepository fakeNewsCheckRepository;
    private final InputSanitizer inputSanitizer;

    public FakeNewsService(FakeNewsCheckRepository fakeNewsCheckRepository, InputSanitizer inputSanitizer) {
        this.fakeNewsCheckRepository = fakeNewsCheckRepository;
        this.inputSanitizer = inputSanitizer;
    }

    public FakeNewsCheck analyze(String userId, String content) {
        String sanitized = inputSanitizer.sanitize(content);
        FakeNewsCheck check = new FakeNewsCheck();
        check.setUserId(userId);
        check.setContent(sanitized);
        check.setVerdict("needs-review");
        check.setConfidenceScore(0.62);
        return fakeNewsCheckRepository.save(check);
    }
}
