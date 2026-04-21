package com.pollpilot.eas.service;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import com.pollpilot.eas.config.JwtUtil;
import com.pollpilot.eas.dto.AuthResponse;
import com.pollpilot.eas.dto.LoginRequest;
import com.pollpilot.eas.dto.SignupRequest;
import com.pollpilot.eas.model.Role;
import com.pollpilot.eas.model.User;
import com.pollpilot.eas.repository.UserRepository;
import java.util.List;
import java.util.Set;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public AuthResponse register(SignupRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already in use");
        }
        User user = new User();
        user.setEmail(request.getEmail().toLowerCase());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setEmailVerified(false);
        user.setRoles(Set.of(Role.USER));
        userRepository.save(user);
        String token = jwtUtil.generateAccessToken(user.getId(), user.getEmail(), List.of(Role.USER.name()));
        return new AuthResponse(token, user.getId(), user.getEmail());
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail().toLowerCase())
                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid credentials");
        }
        String token = jwtUtil.generateAccessToken(user.getId(), user.getEmail(),
                user.getRoles().stream().map(Role::name).toList());
        return new AuthResponse(token, user.getId(), user.getEmail());
    }

    public AuthResponse exchangeFirebaseToken(String idToken) throws Exception {
        FirebaseToken decoded = FirebaseAuth.getInstance().verifyIdToken(idToken);
        String email = decoded.getEmail();
        User user = userRepository.findByEmail(email).orElseGet(() -> {
            User created = new User();
            created.setEmail(email);
            created.setPasswordHash("firebase-managed");
            created.setEmailVerified(true);
            created.setRoles(Set.of(Role.USER));
            return userRepository.save(created);
        });
        String token = jwtUtil.generateAccessToken(user.getId(), user.getEmail(),
                user.getRoles().stream().map(Role::name).toList());
        return new AuthResponse(token, user.getId(), user.getEmail());
    }
}
