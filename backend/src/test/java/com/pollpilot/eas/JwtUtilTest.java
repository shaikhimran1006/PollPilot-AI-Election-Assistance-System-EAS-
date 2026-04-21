package com.pollpilot.eas;

import com.pollpilot.eas.config.JwtUtil;
import io.jsonwebtoken.Claims;
import java.util.List;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

public class JwtUtilTest {
    @Test
    void generatesAndParsesToken() {
        JwtUtil jwtUtil = new JwtUtil("test-secret-key-test-secret-key", "pollpilot", 30);
        String token = jwtUtil.generateAccessToken("user-1", "user@example.com", List.of("USER"));
        Claims claims = jwtUtil.parseClaims(token);
        Assertions.assertEquals("user-1", claims.getSubject());
        Assertions.assertEquals("user@example.com", claims.get("email"));
    }
}
