package com.e_learning.project.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

// Envoi des emails transactionnels (vérification, réinitialisation).
// L'exécution asynchrone et le déclenchement après commit sont gérés par
// VerificationEmailListener : ce service se contente d'envoyer.
@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;
    private final String frontendUrl;
    private final String from;

    public EmailService(
            JavaMailSender mailSender,
            @Value("${app.frontend-url}") String frontendUrl,
            @Value("${app.mail.from}") String from
    ) {
        this.mailSender = mailSender;
        this.frontendUrl = frontendUrl;
        this.from = from;
    }

    public void sendVerificationEmail(String to, String rawToken) {
        String link = frontendUrl + "/verify-email?token=" + rawToken;
        send(to, "Vérifiez votre adresse email",
                "Bienvenue sur EduLearn !\n\n"
                        + "Confirmez votre inscription en cliquant sur ce lien :\n" + link
                        + "\n\nCe lien expire dans 24 heures.");
    }

    public void sendPasswordResetEmail(String to, String rawToken) {
        String link = frontendUrl + "/reset-password?token=" + rawToken;
        send(to, "Réinitialisation de votre mot de passe",
                "Vous avez demandé à réinitialiser votre mot de passe.\n\n"
                        + "Choisissez un nouveau mot de passe via ce lien :\n" + link
                        + "\n\nCe lien expire dans 30 minutes. Si vous n'êtes pas à l'origine "
                        + "de cette demande, ignorez cet email.");
    }

    private void send(String to, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(from);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
        } catch (Exception ex) {
            // On journalise sans propager : l'échec d'envoi ne doit ni casser le flux
            // ni révéler au client si l'adresse existe.
            log.error("Échec d'envoi d'email à {}", to, ex);
        }
    }
}
