package com.e_learning.project.controller;

import com.e_learning.project.dto.SubscriptionRequest;
import com.e_learning.project.dto.SubscriptionResponse;
import com.e_learning.project.exception.ResourceNotFoundException;
import com.e_learning.project.model.UserEntity;
import com.e_learning.project.repository.UserRepository;
import com.e_learning.project.service.SubscriptionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class SubscriptionController {

    private final SubscriptionService subscriptionService;
    private final UserRepository userRepository;

    public SubscriptionController(SubscriptionService subscriptionService, UserRepository userRepository) {
        this.subscriptionService = subscriptionService;
        this.userRepository = userRepository;
    }

    // CREATE — admin accorde un abonnement à un étudiant
    @PostMapping("/students/{studentId}/subscriptions")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SubscriptionResponse> create(@PathVariable UUID studentId,
                                                       @Valid @RequestBody SubscriptionRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(subscriptionService.create(studentId, request));
    }

    // LIST — abonnements d'un étudiant (vue admin)
    @GetMapping("/students/{studentId}/subscriptions")
    @PreAuthorize("hasRole('ADMIN')")
    public List<SubscriptionResponse> listByStudent(@PathVariable UUID studentId) {
        return subscriptionService.listByStudent(studentId);
    }

    // DELETE — révoque un abonnement
    @DeleteMapping("/subscriptions/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        subscriptionService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // LIST — abonnements de l'étudiant connecté (son espace)
    @GetMapping("/me/subscriptions")
    public List<SubscriptionResponse> mySubscriptions(Authentication authentication) {
        UserEntity user = userRepository.findByEmailIgnoreCase(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur introuvable"));
        return subscriptionService.listByStudent(user.getId());
    }
}
