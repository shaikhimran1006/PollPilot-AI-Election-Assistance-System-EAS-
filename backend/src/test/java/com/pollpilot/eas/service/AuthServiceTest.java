package com.pollpilot.eas.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

import com.pollpilot.eas.config.JwtUtil;
import com.pollpilot.eas.dto.AuthResponse;
import com.pollpilot.eas.dto.LoginRequest;
import com.pollpilot.eas.dto.SignupRequest;
import com.pollpilot.eas.model.Role;
import com.pollpilot.eas.model.User;
import com.pollpilot.eas.repository.UserRepository;
import java.util.Optional;
import java.util.Set;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {
    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private AuthService authService;

    @Test
    void registerThrowsWhenEmailExists() {
        SignupRequest request = new SignupRequest();
        request.setEmail("user@example.com");
        request.setPassword("password123");

        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(new User()));

        assertThrows(IllegalArgumentException.class, () -> authService.register(request));
    }

    @Test
    void registerCreatesUserAndToken() {
        SignupRequest request = new SignupRequest();
        request.setEmail("USER@EXAMPLE.COM");
        request.setPassword("password123");

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);

        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("password123")).thenReturn("hashed");
        when(jwtUtil.generateAccessToken(anyString(), eq("user@example.com"), anyList())).thenReturn("token");
        when(userRepository.save(userCaptor.capture())).thenAnswer(invocation -> invocation.getArgument(0));

        AuthResponse response = authService.register(request);

        assertEquals("token", response.getAccessToken());
        assertEquals("user@example.com", response.getEmail());
        assertNotNull(response.getUserId());

        User saved = userCaptor.getValue();
        assertEquals("user@example.com", saved.getEmail());
        assertEquals("hashed", saved.getPasswordHash());
        assertFalse(saved.isEmailVerified());
        assertEquals(Set.of(Role.USER), saved.getRoles());
    }

    @Test
    void loginThrowsOnInvalidPassword() {
        LoginRequest request = new LoginRequest();
        request.setEmail("USER@EXAMPLE.COM");
        request.setPassword("wrongpass");

        User user = new User();
        user.setEmail("user@example.com");
        user.setPasswordHash("hashed");
        user.setRoles(Set.of(Role.USER));

        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrongpass", "hashed")).thenReturn(false);

        assertThrows(IllegalArgumentException.class, () -> authService.login(request));
    }

    @Test
    void loginReturnsTokenOnSuccess() {
        LoginRequest request = new LoginRequest();
        request.setEmail("USER@EXAMPLE.COM");
        request.setPassword("password123");

        User user = new User();
        user.setEmail("user@example.com");
        user.setPasswordHash("hashed");
        user.setRoles(Set.of(Role.USER));

        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("password123", "hashed")).thenReturn(true);
        when(jwtUtil.generateAccessToken(anyString(), eq("user@example.com"), anyList())).thenReturn("token");

        AuthResponse response = authService.login(request);

        assertEquals("token", response.getAccessToken());
        assertEquals("user@example.com", response.getEmail());
        assertEquals(user.getId(), response.getUserId());
    }
}
