package com.e_learning.project.service;

import com.e_learning.project.config.JwtService;
import com.e_learning.project.dto.AuthRequest;
import com.e_learning.project.dto.RegisterRequest;
import com.e_learning.project.dto.RegistrationOptionsResponse;
import com.e_learning.project.dto.UserResponse;
import com.e_learning.project.enums.TokenType;
import com.e_learning.project.event.VerificationLinkRequestedEvent;
import com.e_learning.project.exception.InvalidCredentialsException;
import com.e_learning.project.exception.ResourceAlreadyExistsException;
import com.e_learning.project.exception.ResourceNotFoundException;
import com.e_learning.project.model.ClassEntity;
import com.e_learning.project.model.SectionEntity;
import com.e_learning.project.model.StudentEntity;
import com.e_learning.project.model.UserEntity;
import com.e_learning.project.model.VerificationToken;
import com.e_learning.project.repository.ClassRepository;
import com.e_learning.project.repository.SectionRepository;
import com.e_learning.project.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.util.Map;
import java.util.UUID;

@Service
@Transactional
public class AuthService {

    private final UserRepository userRepository;
    private final ClassRepository classRepository;
    private final SectionRepository sectionRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final VerificationTokenService verificationTokenService;
    private final ApplicationEventPublisher eventPublisher;
    private final String cookieName;
    private final long cookieMaxAge;
    private final boolean cookieSecure;
    private final String cookieSameSite;

    public AuthService(
            UserRepository userRepository,
            ClassRepository classRepository,
            SectionRepository sectionRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            VerificationTokenService verificationTokenService,
            ApplicationEventPublisher eventPublisher,
            @Value("${jwt.cookie.name}") String cookieName,
            @Value("${jwt.cookie.maxAge}") long cookieMaxAge,
            @Value("${jwt.cookie.secure}") boolean cookieSecure,
            @Value("${jwt.cookie.sameSite}") String cookieSameSite
    ) {
        this.userRepository = userRepository;
        this.classRepository = classRepository;
        this.sectionRepository = sectionRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.verificationTokenService = verificationTokenService;
        this.eventPublisher = eventPublisher;
        this.cookieName = cookieName;
        this.cookieMaxAge = cookieMaxAge;
        this.cookieSecure = cookieSecure;
        this.cookieSameSite = cookieSameSite;
    }

    public UserResponse register(RegisterRequest request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmailIgnoreCase(normalizedEmail)) {
            throw new ResourceAlreadyExistsException("Email déjà utilisé : " + normalizedEmail);
        }

        ClassEntity classEntity = resolveClass(request.getClassId());
        StudentEntity entity = StudentEntity.builder()
            .firstName(request.getFirstName())
            .lastName(request.getLastName())
            .email(normalizedEmail)
            .password(passwordEncoder.encode(request.getPassword()))
            .phoneNumber(request.getPhoneNumber())
            .isActive(true)
            .emailVerified(false) // doit vérifier son email avant de pouvoir se connecter
            .level(request.getLevel())
            .section(resolveSection(classEntity.getId(), request.getSection()))
            .establishment(request.getEstablishment())
            .region(request.getRegion())
            .gender(request.getGender())
            .dateOfBirth(request.getDateOfBirth())
            .classEntity(classEntity)
            .build();

        UserEntity saved = userRepository.save(entity);

        // Émet un token de vérification puis publie un événement : l'email est envoyé
        // APRÈS le commit (voir VerificationEmailListener). L'utilisateur n'est PAS
        // connecté automatiquement : il doit d'abord valider son adresse.
        String rawToken = verificationTokenService.issue(saved, TokenType.EMAIL_VERIFICATION);
        eventPublisher.publishEvent(
                new VerificationLinkRequestedEvent(saved.getEmail(), rawToken, TokenType.EMAIL_VERIFICATION));

        return new UserResponse(saved);
    }

    public UserResponse login(AuthRequest request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();
        UserEntity entity = userRepository.findByEmailIgnoreCase(normalizedEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé"));

        if (!entity.isActive()) {
            throw new InvalidCredentialsException("Utilisateur inactif");
        }

        if (!entity.isEmailVerified()) {
            throw new InvalidCredentialsException("Veuillez vérifier votre adresse email avant de vous connecter");
        }

        if (!passwordEncoder.matches(request.getPassword(), entity.getPassword())) {
            throw new InvalidCredentialsException("Email ou mot de passe incorrect");
        }

        // Nouvelle session : invalide toute session ouverte ailleurs (un seul appareil
        // à la fois). Le token émis portera ce sessionId (voir buildAuthCookie).
        entity.setSessionId(UUID.randomUUID().toString());
        return new UserResponse(entity);
    }

    // Active le compte à partir du token reçu par email.
    public void verifyEmail(String rawToken) {
        VerificationToken token = verificationTokenService.consume(rawToken, TokenType.EMAIL_VERIFICATION);
        token.getUser().setEmailVerified(true); // dirty checking → UPDATE en fin de transaction
    }

    // Renvoie un email de vérification (lien expiré / non reçu).
    // ⚠️ Anti-énumération : on n'agit que si le compte existe ET n'est pas déjà vérifié,
    // mais le controller répond 200 dans tous les cas (ne révèle rien).
    public void resendVerification(String email) {
        String normalizedEmail = email.trim().toLowerCase();
        userRepository.findByEmailIgnoreCase(normalizedEmail)
                .filter(user -> !user.isEmailVerified())
                .ifPresent(user -> {
                    String rawToken = verificationTokenService.issue(user, TokenType.EMAIL_VERIFICATION);
                    eventPublisher.publishEvent(
                            new VerificationLinkRequestedEvent(user.getEmail(), rawToken, TokenType.EMAIL_VERIFICATION));
                });
    }

    // ⚠️ Anti-énumération : on ne lève JAMAIS d'erreur si l'email est inconnu.
    // Le controller répond 200 quoi qu'il arrive.
    public void requestPasswordReset(String email) {
        String normalizedEmail = email.trim().toLowerCase();
        userRepository.findByEmailIgnoreCase(normalizedEmail).ifPresent(user -> {
            String rawToken = verificationTokenService.issue(user, TokenType.PASSWORD_RESET);
            eventPublisher.publishEvent(
                    new VerificationLinkRequestedEvent(user.getEmail(), rawToken, TokenType.PASSWORD_RESET));
        });
    }

    public void resetPassword(String rawToken, String newPassword) {
        VerificationToken token = verificationTokenService.consume(rawToken, TokenType.PASSWORD_RESET);
        UserEntity user = token.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        // Réinitialiser via le lien email prouve aussi la possession de l'adresse.
        user.setEmailVerified(true);
        // Sécurité : invalide toute session active (avec l'ancien mot de passe).
        user.setSessionId(null);
    }

    @Transactional(readOnly = true)
    public RegistrationOptionsResponse getRegistrationOptions() {
        return new RegistrationOptionsResponse(
                userRepository.findDistinctEstablishments(),
                userRepository.findDistinctRegions());
    }

    @Transactional(readOnly = true)
    public UserResponse getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getName() == null) {
            throw new ResourceNotFoundException("Utilisateur non trouvé");
        }
        UserEntity entity = userRepository.findByEmailIgnoreCase(auth.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé"));
        return new UserResponse(entity);
    }

    // Résout le nom de section (dans la classe) en entité ; null si absent/introuvable.
    private SectionEntity resolveSection(UUID classId, String sectionName) {
        if (sectionName == null || sectionName.isBlank()) return null;
        return sectionRepository.findByClassEntityIdAndNameIn(classId, java.util.List.of(sectionName.trim()))
                .stream().findFirst().orElse(null);
    }

    private ClassEntity resolveClass(UUID classId) {
        return classRepository.findById(classId)
                .orElseThrow(() -> new ResourceNotFoundException("Classe non trouvée : " + classId));
    }

    // Construit le cookie d'authentification : le token porte le rôle et le sessionId
    // courant du compte (positionné par login) → une seule session active à la fois.
    public ResponseCookie buildAuthCookie(String email) {
        UserEntity user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé"));
        String token = jwtService.generateToken(email, Map.of(
                "role", user.getRole().name(),
                "sid", user.getSessionId()));
        return ResponseCookie.from(cookieName, token)
                .httpOnly(true)
                .secure(cookieSecure)
                .path("/")
                .maxAge(Duration.ofSeconds(cookieMaxAge))
                .sameSite(cookieSameSite)
                .build();
    }

    // Au logout : on efface le sessionId du compte connecté → le token devient invalide
    // immédiatement (il ne pourra plus être réutilisé).
    public void clearCurrentSession() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getName() != null) {
            userRepository.findByEmailIgnoreCase(auth.getName())
                    .ifPresent(user -> user.setSessionId(null));
        }
    }

    public ResponseCookie buildLogoutCookie() {
        return ResponseCookie.from(cookieName, "")
                .httpOnly(true)
                .secure(cookieSecure)
                .path("/")
                .maxAge(Duration.ZERO)
                .sameSite(cookieSameSite)
                .build();
    }
}
