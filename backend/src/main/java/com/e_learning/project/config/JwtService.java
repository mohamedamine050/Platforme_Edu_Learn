package com.e_learning.project.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Map;

@Service
public class JwtService {

    private final SecretKey signingKey;
    private final long expirationMs;

    public JwtService(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.expiration}") long expirationMs
    ) {
        if (secret == null || secret.isBlank()) {
            throw new IllegalArgumentException("JWT secret is required");
        }
        // HS256 exige une clé d'au moins 256 bits (32 octets). On utilise
        // directement les octets UTF-8 du secret : pas d'heuristique base64 fragile.
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        if (keyBytes.length < 32) {
            throw new IllegalArgumentException("JWT secret must be at least 32 bytes long (256 bits) for HS256");
        }
        this.signingKey = Keys.hmacShaKeyFor(keyBytes);
        this.expirationMs = expirationMs;
    }

    public String generateToken(String subject, Map<String, Object> claims) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + expirationMs);
        return Jwts.builder()
                .subject(subject)
                .claims(claims)
                .issuedAt(now)
                .expiration(expiry)
            .signWith(signingKey)
                .compact();
    }

    public String extractSubject(String token) {
        return parseClaims(token).getSubject();
    }

    // Identifiant de session porté par le token (claim "sid"), ou null s'il est absent.
    public String extractSessionId(String token) {
        Object sid = parseClaims(token).get("sid");
        return sid != null ? sid.toString() : null;
    }

    public boolean isTokenValid(String token) {
        try {
            parseClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException ex) {
            return false;
        }
    }

    private Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(signingKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
