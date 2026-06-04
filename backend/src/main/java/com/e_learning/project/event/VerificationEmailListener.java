package com.e_learning.project.event;

import com.e_learning.project.service.EmailService;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

// Écoute les demandes d'envoi de lien et délègue à EmailService.
// @TransactionalEventListener(AFTER_COMMIT) : l'email n'est envoyé QUE si la
// transaction qui a créé le token a bien été committée (pas de lien orphelin).
// @Async : l'envoi (lent) ne bloque pas le thread de la requête.
@Component
public class VerificationEmailListener {

    private final EmailService emailService;

    public VerificationEmailListener(EmailService emailService) {
        this.emailService = emailService;
    }

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onVerificationLinkRequested(VerificationLinkRequestedEvent event) {
        switch (event.type()) {
            case EMAIL_VERIFICATION -> emailService.sendVerificationEmail(event.email(), event.rawToken());
            case PASSWORD_RESET -> emailService.sendPasswordResetEmail(event.email(), event.rawToken());
        }
    }
}
