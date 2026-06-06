package com.e_learning.project.repository;

import com.e_learning.project.model.SubscriptionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface SubscriptionRepository extends JpaRepository<SubscriptionEntity, UUID> {

    /** L'étudiant a-t-il un abonnement ACTIF (date du jour ∈ période) pour cette classe ? */
    @Query("""
            select count(s) > 0 from SubscriptionEntity s
            where s.student.id = :studentId
              and s.classEntity.id = :classId
              and :today between s.startDate and s.endDate
            """)
    boolean hasActiveAccess(@Param("studentId") UUID studentId,
                            @Param("classId") UUID classId,
                            @Param("today") LocalDate today);

    /** L'étudiant possède-t-il (au moins) un abonnement pour cette classe (actif ou non) ? */
    boolean existsByStudentIdAndClassEntityId(UUID studentId, UUID classId);

    /** Deux périodes se chevauchent-elles pour le couple (étudiant, classe) ? */
    @Query("""
            select count(s) > 0 from SubscriptionEntity s
            where s.student.id = :studentId
              and s.classEntity.id = :classId
              and s.startDate <= :endDate
              and s.endDate >= :startDate
            """)
    boolean existsOverlap(@Param("studentId") UUID studentId,
                          @Param("classId") UUID classId,
                          @Param("startDate") LocalDate startDate,
                          @Param("endDate") LocalDate endDate);

    /** Abonnements d'un étudiant, du plus récent (fin la plus lointaine) au plus ancien. */
    List<SubscriptionEntity> findByStudentIdOrderByEndDateDesc(UUID studentId);
}
