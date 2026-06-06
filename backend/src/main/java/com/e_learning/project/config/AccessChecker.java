package com.e_learning.project.config;

import com.e_learning.project.enums.Role;
import com.e_learning.project.repository.ChapterRepository;
import com.e_learning.project.repository.ResourceRepository;
import com.e_learning.project.repository.UserRepository;
import com.e_learning.project.repository.VideoRepository;
import com.e_learning.project.service.AccessControlService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

// Bean exposé à SpEL pour @PreAuthorize et au masquage d'URL des listes.
// L'accès au contenu (vidéos, documents) est désormais lié aux ABONNEMENTS :
// admin OU abonnement actif couvrant la classe du contenu. La vérification est
// faite en base à chaque requête → un abonnement accordé prend effet immédiatement.
@Component("accessChecker")
public class AccessChecker {

    private final UserRepository userRepository;
    private final ChapterRepository chapterRepository;
    private final VideoRepository videoRepository;
    private final ResourceRepository resourceRepository;
    private final AccessControlService accessControl;

    public AccessChecker(UserRepository userRepository,
                         ChapterRepository chapterRepository,
                         VideoRepository videoRepository,
                         ResourceRepository resourceRepository,
                         AccessControlService accessControl) {
        this.userRepository = userRepository;
        this.chapterRepository = chapterRepository;
        this.videoRepository = videoRepository;
        this.resourceRepository = resourceRepository;
        this.accessControl = accessControl;
    }

    /** L'utilisateur courant est-il administrateur ? (utilisé hors contexte d'une classe). */
    @Transactional(readOnly = true)
    public boolean isAdmin() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getName() == null) {
            return false;
        }
        return userRepository.findByEmailIgnoreCase(auth.getName())
                .map(user -> user.getRole() == Role.ADMIN)
                .orElse(false);
    }

    /** Peut lire le contenu d'un chapitre (sa classe) ? */
    @Transactional(readOnly = true)
    public boolean canViewChapter(UUID chapterId) {
        return chapterRepository.findById(chapterId)
                .map(ch -> accessControl.canPlayClass(ch.getCourse().getClassEntity().getId()))
                .orElse(false);
    }

    /** Peut lire une vidéo (la classe de son chapitre) ? */
    @Transactional(readOnly = true)
    public boolean canViewVideo(UUID videoId) {
        return videoRepository.findById(videoId)
                .map(v -> accessControl.canPlayClass(v.getChapter().getCourse().getClassEntity().getId()))
                .orElse(false);
    }

    /** Peut lire un document (la classe de son chapitre) ? */
    @Transactional(readOnly = true)
    public boolean canViewResource(UUID resourceId) {
        return resourceRepository.findById(resourceId)
                .map(r -> accessControl.canPlayClass(r.getChapter().getCourse().getClassEntity().getId()))
                .orElse(false);
    }
}
