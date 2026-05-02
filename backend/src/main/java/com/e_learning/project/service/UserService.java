package com.e_learning.project.service;

import com.e_learning.project.dto.UserRequest;
import com.e_learning.project.dto.UserResponse;
import com.e_learning.project.exception.ResourceAlreadyExistsException;
import com.e_learning.project.exception.ResourceNotFoundException;
import com.e_learning.project.model.Class;
import com.e_learning.project.model.UserEntity;
import com.e_learning.project.repository.ClassRepository;
import com.e_learning.project.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final ClassRepository classRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, ClassRepository classRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.classRepository = classRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserResponse create(UserRequest request) {
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
                    .isActive(Boolean.TRUE.equals(request.getIsActive()))
                    .role(request.getRole())
                    .level(request.getLevel())
                    .gender(request.getGender())
                    .dateOfBirth(request.getDateOfBirth())
                    .classEntity(resolveClass(request.getClassId()))
                    .build();

        UserEntity saved = userRepository.save(entity);
        return new UserResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<UserResponse> getAll() {
        return userRepository.findAll()
                .stream()
                .map(UserResponse::new)
                .toList();
    }

    @Transactional(readOnly = true)
    public UserResponse getById(UUID id) {
        UserEntity entity = userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Utilisateur non trouvé : " + id));

        return new UserResponse(entity);
    }

    public UserResponse update(UUID id, UserRequest request) {
        UserEntity entity = userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Utilisateur non trouvé : " + id));

        String normalizedEmail = request.getEmail().trim().toLowerCase();
        if (!entity.getEmail().equalsIgnoreCase(normalizedEmail)
                && userRepository.existsByEmailIgnoreCase(normalizedEmail)) {
            throw new ResourceAlreadyExistsException("Email déjà utilisé : " + normalizedEmail);
        }

        entity.setFirstName(request.getFirstName());
        entity.setLastName(request.getLastName());
        entity.setEmail(normalizedEmail);
        entity.setPassword(passwordEncoder.encode(request.getPassword()));
        entity.setPhoneNumber(request.getPhoneNumber());
        entity.setActive(Boolean.TRUE.equals(request.getIsActive()));
        entity.setRole(request.getRole());
        entity.setLevel(request.getLevel());
        entity.setGender(request.getGender());
        entity.setDateOfBirth(request.getDateOfBirth());
        entity.setClassEntity(resolveClass(request.getClassId()));

        UserEntity updated = userRepository.save(entity);
        return new UserResponse(updated);
    }

    public void delete(UUID id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("Utilisateur non trouvé : " + id);
        }
        userRepository.deleteById(id);
    }

    private Class resolveClass(Long classId) {
        return classRepository.findById(classId)
                .orElseThrow(() -> new ResourceNotFoundException("Classe non trouvée : " + classId));
    }
}
