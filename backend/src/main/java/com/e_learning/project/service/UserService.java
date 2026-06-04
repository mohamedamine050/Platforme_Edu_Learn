package com.e_learning.project.service;

import com.e_learning.project.dto.PageResponse;
import com.e_learning.project.dto.UserRequest;
import com.e_learning.project.dto.UserResponse;
import com.e_learning.project.enums.Role;
import com.e_learning.project.exception.ResourceAlreadyExistsException;
import com.e_learning.project.exception.ResourceNotFoundException;
import com.e_learning.project.model.AdminEntity;
import com.e_learning.project.model.ClassEntity;
import com.e_learning.project.model.SectionEntity;
import com.e_learning.project.model.StudentEntity;
import com.e_learning.project.model.UserEntity;
import com.e_learning.project.repository.ClassRepository;
import com.e_learning.project.repository.SectionRepository;
import com.e_learning.project.repository.UserRepository;
import com.e_learning.project.util.Filters;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final ClassRepository classRepository;
    private final SectionRepository sectionRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, ClassRepository classRepository,
                       SectionRepository sectionRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.classRepository = classRepository;
        this.sectionRepository = sectionRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // Résout le nom de section (dans la classe) en entité ; null si absent/introuvable.
    private SectionEntity resolveSection(UUID classId, String sectionName) {
        if (sectionName == null || sectionName.isBlank()) return null;
        return sectionRepository.findByClassEntityIdAndNameIn(classId, java.util.List.of(sectionName.trim()))
                .stream().findFirst().orElse(null);
    }

    public UserResponse create(UserRequest request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmailIgnoreCase(normalizedEmail)) {
            throw new ResourceAlreadyExistsException("Email déjà utilisé : " + normalizedEmail);
        }

        UserEntity entity;
        if (request.getRole() == Role.ADMIN) {
            entity = AdminEntity.builder()
                    .firstName(request.getFirstName())
                    .lastName(request.getLastName())
                    .email(normalizedEmail)
                    .password(passwordEncoder.encode(request.getPassword()))
                    .phoneNumber(request.getPhoneNumber())
                    .isActive(Boolean.TRUE.equals(request.getIsActive()))
                    .build();
        } else {
            requireStudentFields(request);
            ClassEntity studentClass = resolveClass(request.getClassId());
            entity = StudentEntity.builder()
                    .firstName(request.getFirstName())
                    .lastName(request.getLastName())
                    .email(normalizedEmail)
                    .password(passwordEncoder.encode(request.getPassword()))
                    .phoneNumber(request.getPhoneNumber())
                    .isActive(Boolean.TRUE.equals(request.getIsActive()))
                    .level(request.getLevel())
                    .section(resolveSection(studentClass.getId(), request.getSection()))
                    .establishment(request.getEstablishment())
                    .region(request.getRegion())
                    .gender(request.getGender())
                    .dateOfBirth(request.getDateOfBirth())
                    .classEntity(studentClass)
                    .build();
        }

        UserEntity saved = userRepository.save(entity);
        return new UserResponse(saved);
    }

    @Transactional(readOnly = true)
    public PageResponse<UserResponse> getAll(Role role, String search, Pageable pageable) {
        String pattern = Filters.likePattern(search);
        Page<UserEntity> users;
        if (role == null) {
            users = userRepository.search(pattern, pageable);
        } else if (role == Role.ADMIN) {
            users = userRepository.searchByType(AdminEntity.class, pattern, pageable);
        } else {
            users = userRepository.searchByType(StudentEntity.class, pattern, pageable);
        }
        return PageResponse.from(users.map(UserResponse::new));
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

        if (request.getRole() != entity.getRole()) {
            throw new IllegalArgumentException("Impossible de changer le rôle/type d'un utilisateur existant");
        }

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

        if (entity instanceof StudentEntity student) {
            requireStudentFields(request);
            ClassEntity studentClass = resolveClass(request.getClassId());
            student.setLevel(request.getLevel());
            student.setEstablishment(request.getEstablishment());
            student.setRegion(request.getRegion());
            student.setGender(request.getGender());
            student.setDateOfBirth(request.getDateOfBirth());
            student.setClassEntity(studentClass);
            student.setSection(resolveSection(studentClass.getId(), request.getSection()));
        }

        UserEntity updated = userRepository.save(entity);
        return new UserResponse(updated);
    }

    public void delete(UUID id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("Utilisateur non trouvé : " + id);
        }
        userRepository.deleteById(id);
    }

    // Accorde ou révoque l'accès au contenu (action admin).
    public UserResponse setAccess(UUID id, boolean granted) {
        UserEntity entity = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé : " + id));
        entity.setAccessGranted(granted);
        return new UserResponse(userRepository.save(entity));
    }

    private void requireStudentFields(UserRequest request) {
        if (request.getLevel() == null || request.getLevel().isBlank()
                || request.getEstablishment() == null || request.getEstablishment().isBlank()
                || request.getRegion() == null || request.getRegion().isBlank()
                || request.getGender() == null
                || request.getDateOfBirth() == null
                || request.getClassId() == null) {
            throw new IllegalArgumentException(
                    "Le niveau, l'établissement, la région, le genre, la date de naissance et la classe sont obligatoires pour un étudiant");
        }
    }

    private ClassEntity resolveClass(UUID classId) {
        return classRepository.findById(classId)
                .orElseThrow(() -> new ResourceNotFoundException("Classe non trouvée : " + classId));
    }
}
