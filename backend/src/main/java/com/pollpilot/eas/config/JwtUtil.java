package com.pollpilot.eas.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.util.Date;
import java.util.List;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class JwtUtil {
    private final SecretKey secretKey;
    private final String issuer;
    private final long accessTokenMinutes;

    public JwtUtil(
            @Value("${security.jwt.secret}") String secret,
            @Value("${security.jwt.issuer}") String issuer,
            @Value("${security.jwt.accessTokenMinutes}") long accessTokenMinutes) {
        this.secretKey = Keys.hmacShaKeyFor(deriveSecureKey(secret));
        this.issuer = issuer;
        this.accessTokenMinutes = accessTokenMinutes;
    }

    private byte[] deriveSecureKey(String secret) {
        byte[] raw = secret.getBytes(StandardCharsets.UTF_8);
        if (raw.length >= 32) {
            return raw;
        }
        try {
            return MessageDigest.getInstance("SHA-256").digest(raw);
        } catch (Exception ex) {
            throw new IllegalStateException("Unable to derive secure JWT key", ex);
        }
    }

    public String generateAccessToken(String userId, String email, List<String> roles) {
        Instant now = Instant.now();
        Instant expires = now.plusSeconds(accessTokenMinutes * 60);
        return Jwts.builder()
                .setSubject(userId)
                .setIssuer(issuer)
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(expires))
                .claim("email", email)
                .claim("roles", roles)
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .compact();
    }

    public Claims parseClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
