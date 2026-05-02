package com.e_learning.project.service;

import com.e_learning.project.config.JwtService;
import com.e_learning.project.dto.AuthRequest;
import com.e_learning.project.dto.RegisterRequest;
import com.e_learning.project.dto.UserResponse;
import com.e_learning.project.enums.Role;
import com.e_learning.project.exception.InvalidCredentialsException;
import com.e_learning.project.exception.ResourceAlreadyExistsException;
import com.e_learning.project.exception.ResourceNotFoundException;
import com.e_learning.project.model.Class;
import com.e_learning.project.model.UserEntity;
import com.e_learning.project.repository.ClassRepository;
import com.e_learning.project.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Map;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final ClassRepository classRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final String cookieName;
    private final long cookieMaxAge;
    private final boolean cookieSecure;
    private final String cookieSameSite;

    public AuthService(
            UserRepository userRepository,
            ClassRepository classRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            @Value("${jwt.cookie.name}") String cookieName,
            @Value("${jwt.cookie.maxAge}") long cookieMaxAge,
            @Value("${jwt.cookie.secure}") boolean cookieSecure,
            @Value("${jwt.cookie.sameSite}") String cookieSameSite
    ) {
        this.userRepository = userRepository;
        this.classRepository = classRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
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

        UserEntity entity = UserEntity.builder()
            .firstName(request.getFirstName())
            .lastName(request.getLastName())
            .email(normalizedEmail)
            .password(passwordEncoder.encode(request.getPassword()))
            .phoneNumber(request.getPhoneNumber())
            .isActive(true)
            .role(Role.STUDENT)
            .level(request.getLevel())
            .gender(request.getGender())
            .dateOfBirth(request.getDateOfBirth())
            .classEntity(resolveClass(request.getClassId()))
            .build();

        UserEntity saved = userRepository.save(entity);
        return new UserResponse(saved);
    }

    public UserResponse login(AuthRequest request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();
        UserEntity entity = userRepository.findByEmailIgnoreCase(normalizedEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé"));

        if (!entity.isActive()) {
            throw new InvalidCredentialsException("Utilisateur inactif");
        }

        if (!passwordEncoder.matches(request.getPassword(), entity.getPassword())) {
            throw new InvalidCredentialsException("Email ou mot de passe incorrect");
        }

        return new UserResponse(entity);
    }

    public UserResponse getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getName() == null) {
            throw new ResourceNotFoundException("Utilisateur non trouvé");
        }
        UserEntity entity = userRepository.findByEmailIgnoreCase(auth.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé"));
        return new UserResponse(entity);
    }

    private Class resolveClass(Long classId) {
        return classRepository.findById(classId)
                .orElseThrow(() -> new ResourceNotFoundException("Classe non trouvée : " + classId));
    }

    public ResponseCookie buildAuthCookie(String email, String role) {
        String token = jwtService.generateToken(email, Map.of("role", role));
        return ResponseCookie.from(cookieName, token)
                .httpOnly(true)
                .secure(cookieSecure)
                .path("/")
                .maxAge(Duration.ofSeconds(cookieMaxAge))
                .sameSite(cookieSameSite)
                .build();
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
