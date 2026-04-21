package com.pollpilot.eas.controller;

import com.pollpilot.eas.dto.PollingSearchRequest;
import com.pollpilot.eas.model.PollingLocation;
import com.pollpilot.eas.service.CurrentUserService;
import com.pollpilot.eas.service.PollingLocationService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/polling")
public class PollingController {
    private final PollingLocationService pollingLocationService;
    private final CurrentUserService currentUserService;

    public PollingController(PollingLocationService pollingLocationService, CurrentUserService currentUserService) {
        this.pollingLocationService = pollingLocationService;
        this.currentUserService = currentUserService;
    }

    @PostMapping("/search")
    public ResponseEntity<List<PollingLocation>> search(@Valid @RequestBody PollingSearchRequest request)
            throws Exception {
        return ResponseEntity
                .ok(pollingLocationService.searchLocations(currentUserService.getUserId(), request.getAddress()));
    }
}
