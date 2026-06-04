package com.e_learning.project.service;

import com.e_learning.project.dto.ClassRequest;
import com.e_learning.project.dto.ClassResponse;
import com.e_learning.project.dto.OfferResponse;
import com.e_learning.project.dto.PageResponse;
import com.e_learning.project.dto.SectionRequest;
import com.e_learning.project.enums.Level;
import com.e_learning.project.model.ClassEntity;
import com.e_learning.project.model.SectionEntity;
import com.e_learning.project.exception.ResourceNotFoundException;
import com.e_learning.project.exception.ResourceAlreadyExistsException;
import com.e_learning.project.repository.ChapterRepository;
import com.e_learning.project.repository.ClassRepository;
import com.e_learning.project.repository.CourseRepository;
import com.e_learning.project.repository.UserRepository;
import com.e_learning.project.util.Filters;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@Transactional
public class ClassService {

    private final ClassRepository classRepository;
    private final CourseRepository courseRepository;
    private final ChapterRepository chapterRepository;
    private final UserRepository userRepository;

    public ClassService(ClassRepository classRepository,
                        CourseRepository courseRepository,
                        ChapterRepository chapterRepository,
                        UserRepository userRepository) {
        this.classRepository = classRepository;
        this.courseRepository = courseRepository;
        this.chapterRepository = chapterRepository;
        this.userRepository = userRepository;
    }

    public ClassResponse create(ClassRequest request) {
        if (classRepository.existsByTitleAndLevel(request.getTitle(), request.getLevel())) {
            throw new ResourceAlreadyExistsException("Classe déjà existante : " + request.getTitle() + " - " + request.getLevel());
        }

        ClassEntity entity = ClassEntity.builder()
                .title(request.getTitle())
                .level(request.getLevel())
                .price(request.getPrice() != null ? request.getPrice() : BigDecimal.ZERO)
                .build();

        // Crée les sections (entités) avec leur prix.
        normalizeSections(request.getSections()).forEach((name, price) ->
                entity.getSections().add(SectionEntity.builder().name(name).price(price).classEntity(entity).build()));

        ClassEntity saved = classRepository.save(entity); // cascade → sections persistées
        return new ClassResponse(saved);
    }

    @Transactional(readOnly = true)
    public PageResponse<ClassResponse> getAll(Level level, String search, Pageable pageable) {
        return PageResponse.from(
                classRepository.search(
                                level == null ? null : level.name(),
                                Filters.likePattern(search),
                                pageable)
                        .map(ClassResponse::new));
    }

    // Liste publique allégée pour la page « Offres » / l'accueil (non paginée).
    @Transactional(readOnly = true)
    public List<OfferResponse> getOffers() {
        return classRepository.findAllWithSections().stream()
                .map(OfferResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public ClassResponse getById(UUID id) {
        ClassEntity entity = classRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Classe non trouvée : " + id));

        return new ClassResponse(entity);
    }

    public ClassResponse update(UUID id, ClassRequest request) {
        ClassEntity entity = classRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Classe non trouvée : " + id));

        entity.setTitle(request.getTitle());
        entity.setLevel(request.getLevel());
        entity.setPrice(request.getPrice() != null ? request.getPrice() : BigDecimal.ZERO);

        // Synchronisation par NOM : les sections au nom inchangé conservent leur id
        // (les ciblages cours/chapitre restent valides) et leur prix est mis à jour.
        // Nouveaux noms = ajout ; absents = suppression.
        Map<String, BigDecimal> incoming = normalizeSections(request.getSections());

        // Refus propre : on n'autorise pas de retirer une section utilisée par un cours/chapitre
        // (sinon violation de clé étrangère). L'admin doit d'abord la retirer de leur ciblage.
        for (SectionEntity sec : entity.getSections()) {
            if (incoming.containsKey(sec.getName())) continue; // section conservée
            if (courseRepository.isSectionTargeted(sec.getId()) || chapterRepository.isSectionTargeted(sec.getId())) {
                throw new IllegalArgumentException("Impossible de retirer la section « " + sec.getName()
                        + " » : elle est utilisée par un cours ou un chapitre.");
            }
            if (userRepository.existsStudentInSection(sec.getId())) {
                throw new IllegalArgumentException("Impossible de retirer la section « " + sec.getName()
                        + " » : des étudiants y sont inscrits.");
            }
        }

        entity.getSections().removeIf(sec -> !incoming.containsKey(sec.getName()));
        for (SectionEntity sec : entity.getSections()) {
            sec.setPrice(incoming.get(sec.getName())); // met à jour le prix des sections conservées
        }
        java.util.Set<String> existing = new java.util.HashSet<>();
        entity.getSections().forEach(s -> existing.add(s.getName()));
        incoming.forEach((name, price) -> {
            if (!existing.contains(name)) {
                entity.getSections().add(SectionEntity.builder().name(name).price(price).classEntity(entity).build());
            }
        });

        ClassEntity updated = classRepository.save(entity);
        return new ClassResponse(updated);
    }

    public void delete(UUID id) {
        if (!classRepository.existsById(id)) {
            throw new ResourceNotFoundException("Classe non trouvée : " + id);
        }
        classRepository.deleteById(id);
    }

    // Nom -> prix, noms nettoyés/non vides/sans doublons (le dernier prix gagne en cas de doublon).
    private Map<String, BigDecimal> normalizeSections(List<SectionRequest> sections) {
        Map<String, BigDecimal> result = new LinkedHashMap<>();
        if (sections == null) return result;
        for (SectionRequest s : sections) {
            if (s == null || s.getName() == null || s.getName().isBlank()) continue;
            result.put(s.getName().trim(), s.getPrice() != null ? s.getPrice() : BigDecimal.ZERO);
        }
        return result;
    }
}