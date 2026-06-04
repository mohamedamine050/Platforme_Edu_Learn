package com.e_learning.project.config;

import com.e_learning.project.model.AdminEntity;
import com.e_learning.project.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Bootstrap de l'administrateur par défaut — TOUS environnements.
 * Idempotent : ne crée l'admin que s'il n'existe pas déjà.
 * ⚠️ En production : changer ce mot de passe dès le premier accès.
 * admin@edulearn.com / 123456
 */
@Component
@Order(1) // s'exécute avant DevDataInitializer
public class AdminInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.existsByEmailIgnoreCase("admin@edulearn.com")) {
            return;
        }
        userRepository.save(AdminEntity.builder()
                .firstName("Admin").lastName("EduLearn")
                .email("admin@edulearn.com")
                .password(passwordEncoder.encode("123456"))
                .isActive(true)
                .accessGranted(true)
                .build());
    }
}
