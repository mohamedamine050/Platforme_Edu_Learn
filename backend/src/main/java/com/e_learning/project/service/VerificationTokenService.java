package com.e_learning.project.service;

import com.e_learning.project.enums.TokenType;
import com.e_learning.project.exception.InvalidTokenException;
import com.e_learning.project.model.UserEntity;
import com.e_learning.project.model.VerificationToken;
import com.e_learning.project.repository.VerificationTokenRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.HexFormat;

// Génère, hache et consomme les tokens de vérification d'email et de réinitialisation.
// ⚠️ Le token brut n'est JAMAIS persisté : seul son hash SHA-256 l'est.
@Service
@Transactional
public class VerificationTokenService {

    private static final SecureRandom SECURE_RANDOM = new SecureRandom();
    private static final int TOKEN_BYTES = 32; // 256 bits d'entropie

    private final VerificationTokenRepository tokenRepository;
    private final Duration emailTtl;
    private final Duration resetTtl;

    public VerificationTokenService(
            VerificationTokenRepository tokenRepository,
            @Value("${app.verification.email-token-ttl}") Duration emailTtl,
            @Value("${app.verification.reset-token-ttl}") Duration resetTtl
    ) {
        this.tokenRepository = tokenRepository;
        this.emailTtl = emailTtl;
        this.resetTtl = resetTtl;
    }

    // Crée un token, persiste son HASH, renvoie le token BRUT (à insérer dans l'email).
    // On supprime d'abord les anciens tokens du même type : un seul lien actif.
    public String issue(UserEntity user, TokenType type) {
        tokenRepository.deleteByUserAndType(user, type);

        String rawToken = generateRawToken();
        Duration ttl = (type == TokenType.PASSWORD_RESET) ? resetTtl : emailTtl;

        VerificationToken token = VerificationToken.builder()
                .tokenHash(hash(rawToken))
                .type(type)
                .user(user)
                .expiresAt(LocalDateTime.now().plus(ttl))
                .build();
        tokenRepository.save(token);

        return rawToken;
    }

    // Valide (existe + bon type + non expiré + non utilisé) puis MARQUE comme utilisé.
    // Renvoie le token afin que l'appelant accède au compte lié.
    public VerificationToken consume(String rawToken, TokenType type) {
        VerificationToken token = tokenRepository
                .findByTokenHashAndType(hash(rawToken), type)
                .orElseThrow(() -> new InvalidTokenException("Lien invalide ou expiré"));

        // Message volontairement identique dans tous les cas d'échec :
        // on ne révèle pas si le token a expiré, a déjà servi, ou n'existe pas.
        if (token.isExpired() || token.isUsed()) {
            throw new InvalidTokenException("Lien invalide ou expiré");
        }

        token.setUsedAt(LocalDateTime.now()); // usage unique (dirty checking → UPDATE)
        return token;
    }

    private String generateRawToken() {
        byte[] bytes = new byte[TOKEN_BYTES];
        SECURE_RANDOM.nextBytes(bytes);
        // URL-safe : le token voyage dans une query string.
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    // SHA-256 suffit : le token a déjà 256 bits d'entropie aléatoire (pas besoin de
    // ralentir le calcul comme pour un mot de passe choisi par un humain).
    private String hash(String rawToken) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashed = digest.digest(rawToken.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hashed);
        } catch (NoSuchAlgorithmException ex) {
            throw new IllegalStateException("SHA-256 indisponible", ex);
        }
    }
}
