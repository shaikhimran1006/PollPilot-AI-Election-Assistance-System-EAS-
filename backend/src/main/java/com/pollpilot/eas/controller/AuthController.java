package com.pollpilot.eas.controller;

import com.pollpilot.eas.dto.AuthResponse;
import com.pollpilot.eas.dto.FirebaseAuthRequest;
import com.pollpilot.eas.dto.LoginRequest;
import com.pollpilot.eas.dto.SignupRequest;
import com.pollpilot.eas.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@Valid @RequestBody SignupRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/firebase")
    public ResponseEntity<AuthResponse> firebase(@Valid @RequestBody FirebaseAuthRequest request) throws Exception {
        return ResponseEntity.ok(authService.exchangeFirebaseToken(request.getIdToken()));
    }
}
