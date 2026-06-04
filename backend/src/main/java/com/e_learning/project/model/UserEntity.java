package com.e_learning.project.model;

import com.e_learning.project.enums.Role;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "users")
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn(name = "role", discriminatorType = DiscriminatorType.STRING)
@Getter
@Setter
@NoArgsConstructor
@SuperBuilder
public abstract class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "is_active", nullable = false)
    @lombok.Builder.Default
    private boolean isActive = true;

    // L'email a-t-il été vérifié via le lien envoyé à l'inscription ?
    // Tant que false, le login est refusé (voir AuthService.login).
    @Column(name = "email_verified", nullable = false)
    @lombok.Builder.Default
    private boolean emailVerified = false;

    // L'admin a-t-il accordé l'accès au contenu (vidéos / documents) ?
    // L'étudiant peut se connecter et parcourir, mais le contenu reste verrouillé
    // tant que false. Les admins l'ont à true.
    @Column(name = "access_granted", nullable = false)
    @lombok.Builder.Default
    private boolean accessGranted = false;

    // Identifiant de la session active (une seule à la fois). Régénéré à chaque login :
    // le token doit porter ce même identifiant, sinon il est rejeté → une nouvelle
    // connexion déconnecte automatiquement la précédente.
    @Column(name = "session_id")
    private String sessionId;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }

    public abstract Role getRole();
}
