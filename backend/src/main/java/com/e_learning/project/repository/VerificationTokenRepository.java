package com.e_learning.project.repository;

import com.e_learning.project.enums.TokenType;
import com.e_learning.project.model.UserEntity;
import com.e_learning.project.model.VerificationToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

public interface VerificationTokenRepository extends JpaRepository<VerificationToken, UUID> {

    Optional<VerificationToken> findByTokenHashAndType(String tokenHash, TokenType type);

    // Avant d'émettre un nouveau token, on supprime les anciens du même type :
    // un seul lien valide à la fois (limite la surface d'attaque).
    @Modifying
    void deleteByUserAndType(UserEntity user, TokenType type);

    // Purge des tokens « morts » (expirés ou déjà utilisés) : empêche la table
    // de gonfler inutilement. Appelée par une tâche planifiée (voir TokenCleanupService).
    @Modifying
    @Query("DELETE FROM VerificationToken t WHERE t.expiresAt < :now OR t.usedAt IS NOT NULL")
    int deleteExpiredOrUsed(@Param("now") LocalDateTime now);
}
