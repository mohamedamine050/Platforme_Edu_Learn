package com.e_learning.project.service;

import com.e_learning.project.repository.VerificationTokenRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

// Supprime périodiquement les tokens « morts » (expirés ou déjà utilisés) pour
// éviter que la table verification_tokens ne gonfle avec des lignes inutiles.
@Service
public class TokenCleanupService {

    private static final Logger log = LoggerFactory.getLogger(TokenCleanupService.class);

    private final VerificationTokenRepository tokenRepository;

    public TokenCleanupService(VerificationTokenRepository tokenRepository) {
        this.tokenRepository = tokenRepository;
    }

    // Tous les jours à 3 h du matin (heure creuse). Configurable via APP_TOKEN_CLEANUP_CRON.
    @Scheduled(cron = "${app.token-cleanup.cron:0 0 3 * * *}")
    @Transactional
    public void purgeExpiredOrUsedTokens() {
        int deleted = tokenRepository.deleteExpiredOrUsed(LocalDateTime.now());
        if (deleted > 0) {
            log.info("Nettoyage des tokens : {} token(s) expiré(s)/utilisé(s) supprimé(s)", deleted);
        }
    }
}
