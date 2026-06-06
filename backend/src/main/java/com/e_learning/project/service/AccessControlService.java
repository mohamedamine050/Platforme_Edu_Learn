package com.e_learning.project.service;

import com.e_learning.project.model.ChapterEntity;
import com.e_learning.project.model.CourseEntity;
import com.e_learning.project.model.SectionEntity;
import com.e_learning.project.model.StudentEntity;
import com.e_learning.project.model.UserEntity;
import com.e_learning.project.repository.SubscriptionRepository;
import com.e_learning.project.repository.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Set;
import java.util.UUID;

/**
 * Autorisation du contenu :
 *  - un administrateur voit tout ;
 *  - un étudiant ne voit que SA classe, et au sein d'un chapitre, seulement
 *    les chapitres communs (sans section) ou ciblant SA section.
 */
@Service
public class AccessControlService {

    private final UserRepository userRepository;
    private final SubscriptionRepository subscriptionRepository;

    public AccessControlService(UserRepository userRepository,
                                SubscriptionRepository subscriptionRepository) {
        this.userRepository = userRepository;
        this.subscriptionRepository = subscriptionRepository;
    }

    /**
     * Accès en consultation (parcourir titres / chapitres) : la classe d'inscription
     * de l'étudiant OU toute classe pour laquelle il possède un abonnement (la lecture
     * réelle des vidéos reste conditionnée par {@link #canPlayClass(UUID)}).
     */
    @Transactional(readOnly = true)
    public void checkClassAccess(UUID classId) {
        Authentication auth = requireAuth();
        if (isAdmin(auth)) {
            return;
        }
        StudentEntity student = currentStudent(auth);
        if (student == null) {
            throw new AccessDeniedException("Accès refusé");
        }
        UUID ownClassId = student.getClassEntity() != null ? student.getClassEntity().getId() : null;
        boolean ownClass = classId.equals(ownClassId);
        boolean purchased = subscriptionRepository.existsByStudentIdAndClassEntityId(student.getId(), classId);
        if (!ownClass && !purchased) {
            throw new AccessDeniedException("Accès réservé à votre classe ou à vos abonnements");
        }
    }

    /**
     * Lecture du contenu (URL vidéo / document) : autorisée pour un admin, ou pour un
     * étudiant disposant d'un abonnement ACTIF (date du jour ∈ période) sur la classe.
     */
    @Transactional(readOnly = true)
    public boolean canPlayClass(UUID classId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return false;
        }
        if (isAdmin(auth)) {
            return true;
        }
        StudentEntity student = currentStudent(auth);
        return student != null
                && subscriptionRepository.hasActiveAccess(student.getId(), classId, LocalDate.now());
    }

    /** Classe + visibilité de section de la matière. */
    @Transactional(readOnly = true)
    public void checkCourseAccess(CourseEntity course) {
        checkClassAccess(course.getClassEntity().getId());
        enforceSectionVisibility(course.getSections());
    }

    /** Matière (donc classe + section matière) + visibilité de section du chapitre. */
    @Transactional(readOnly = true)
    public void checkChapterAccess(ChapterEntity chapter) {
        checkCourseAccess(chapter.getCourse());
        enforceSectionVisibility(chapter.getSections());
    }

    /**
     * Section servant à filtrer les listes de chapitres.
     * null = aucun filtre (admin, ou étudiant sans section → voit tout le cours).
     */
    @Transactional(readOnly = true)
    public SectionEntity currentSectionFilter() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || isAdmin(auth)) {
            return null;
        }
        StudentEntity student = currentStudent(auth);
        return student != null ? student.getSection() : null;
    }

    // ---- helpers ----

    // Vide = commun (visible par toutes les sections). Sinon, doit contenir la section de l'étudiant (comparaison par id).
    private void enforceSectionVisibility(Set<SectionEntity> targeted) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (isAdmin(auth)) {
            return;
        }
        if (targeted == null || targeted.isEmpty()) {
            return;
        }
        StudentEntity student = currentStudent(auth);
        UUID mySectionId = (student != null && student.getSection() != null) ? student.getSection().getId() : null;
        boolean visible = mySectionId != null && targeted.stream().anyMatch(s -> mySectionId.equals(s.getId()));
        if (!visible) {
            throw new AccessDeniedException("Contenu non destiné à votre section");
        }
    }

    private Authentication requireAuth() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new AccessDeniedException("Authentification requise");
        }
        return auth;
    }

    private boolean isAdmin(Authentication auth) {
        return auth != null && auth.getAuthorities().stream()
                .anyMatch(a -> "ROLE_ADMIN".equals(a.getAuthority()));
    }

    private StudentEntity currentStudent(Authentication auth) {
        UserEntity user = userRepository.findByEmailIgnoreCase(auth.getName())
                .orElseThrow(() -> new AccessDeniedException("Accès refusé"));
        return user instanceof StudentEntity student ? student : null;
    }
}
