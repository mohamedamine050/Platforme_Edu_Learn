package com.e_learning.project.service;

import com.e_learning.project.dto.SubscriptionRequest;
import com.e_learning.project.dto.SubscriptionResponse;
import com.e_learning.project.exception.ResourceAlreadyExistsException;
import com.e_learning.project.exception.ResourceNotFoundException;
import com.e_learning.project.model.ClassEntity;
import com.e_learning.project.model.StudentEntity;
import com.e_learning.project.model.SubscriptionEntity;
import com.e_learning.project.model.UserEntity;
import com.e_learning.project.repository.ClassRepository;
import com.e_learning.project.repository.SubscriptionRepository;
import com.e_learning.project.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

/**
 * Gestion des abonnements (action administrateur).
 * Un abonnement = 1 étudiant + 1 classe + une période [start, end].
 */
@Service
@Transactional
public class SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final UserRepository userRepository;
    private final ClassRepository classRepository;

    public SubscriptionService(SubscriptionRepository subscriptionRepository,
                               UserRepository userRepository,
                               ClassRepository classRepository) {
        this.subscriptionRepository = subscriptionRepository;
        this.userRepository = userRepository;
        this.classRepository = classRepository;
    }

    public SubscriptionResponse create(UUID studentId, SubscriptionRequest request) {
        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new IllegalArgumentException("La date de fin doit être postérieure ou égale à la date de début");
        }

        StudentEntity student = requireStudent(studentId);

        ClassEntity classEntity = classRepository.findById(request.getClassId())
                .orElseThrow(() -> new ResourceNotFoundException("Classe introuvable : " + request.getClassId()));

        if (subscriptionRepository.existsOverlap(studentId, classEntity.getId(),
                request.getStartDate(), request.getEndDate())) {
            throw new ResourceAlreadyExistsException(
                    "Un abonnement couvre déjà cette période pour cette classe");
        }

        SubscriptionEntity subscription = SubscriptionEntity.builder()
                .student(student)
                .classEntity(classEntity)
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .build();

        return new SubscriptionResponse(subscriptionRepository.save(subscription));
    }

    @Transactional(readOnly = true)
    public List<SubscriptionResponse> listByStudent(UUID studentId) {
        requireStudent(studentId);
        return subscriptionRepository.findByStudentIdOrderByEndDateDesc(studentId).stream()
                .map(SubscriptionResponse::new)
                .toList();
    }

    public void delete(UUID id) {
        if (!subscriptionRepository.existsById(id)) {
            throw new ResourceNotFoundException("Abonnement introuvable : " + id);
        }
        subscriptionRepository.deleteById(id);
    }

    private StudentEntity requireStudent(UUID studentId) {
        UserEntity user = userRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur introuvable : " + studentId));
        if (!(user instanceof StudentEntity student)) {
            throw new IllegalArgumentException("Seuls les étudiants peuvent avoir un abonnement");
        }
        return student;
    }
}
