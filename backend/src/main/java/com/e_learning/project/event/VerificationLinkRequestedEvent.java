package com.e_learning.project.event;

import com.e_learning.project.enums.TokenType;

// Événement publié quand un lien (vérification d'email ou réinitialisation) doit être
// envoyé. Il est traité APRÈS le commit de la transaction (voir VerificationEmailListener),
// pour ne jamais envoyer d'email si l'enregistrement en base échoue.
public record VerificationLinkRequestedEvent(String email, String rawToken, TokenType type) {
}
