package com.e_learning.project.config;

import com.e_learning.project.enums.Role;
import com.e_learning.project.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

// Bean exposé à SpEL pour @PreAuthorize : autorise l'accès au contenu (vidéos,
// documents) si l'utilisateur est admin OU si l'admin lui a accordé l'accès.
// La vérification est faite en base à chaque requête → un accès accordé prend
// effet immédiatement, sans re-connexion.
@Component("accessChecker")
public class AccessChecker {

    private final UserRepository userRepository;

    public AccessChecker(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public boolean canViewContent() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getName() == null) {
            return false;
        }
        return userRepository.findByEmailIgnoreCase(auth.getName())
                .map(user -> user.getRole() == Role.ADMIN || user.isAccessGranted())
                .orElse(false);
    }
}
