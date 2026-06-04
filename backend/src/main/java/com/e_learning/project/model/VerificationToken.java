package com.e_learning.project.model;

import com.e_learning.project.enums.TokenType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "verification_tokens")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VerificationToken {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    // On stocke le HASH (SHA-256, hex) du token, JAMAIS le token brut.
    // unique = un même hash ne peut exister deux fois ; sert aussi d'index de recherche.
    @Column(name = "token_hash", nullable = false, unique = true)
    private String tokenHash;

    // Type d'usage : un seul mécanisme sert la vérification d'email ET le reset de mot de passe.
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TokenType type;

    // Compte cible. LAZY : chargé à la demande, dans la transaction.
    // ON DELETE CASCADE : les tokens n'ont aucun sens sans leur utilisateur ; ils sont
    // supprimés automatiquement quand le compte est supprimé.
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private UserEntity user;

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    // Horodatage de consommation : null = pas encore utilisé (garantit l'usage unique).
    @Column(name = "used_at")
    private LocalDateTime usedAt;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }

    // Helpers métier : gardent la logique de validité au même endroit que l'état.
    public boolean isExpired() {
        return expiresAt.isBefore(LocalDateTime.now());
    }

    public boolean isUsed() {
        return usedAt != null;
    }
}
