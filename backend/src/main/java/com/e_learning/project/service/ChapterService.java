package com.e_learning.project.service;

import com.e_learning.project.dto.ChapterRequest;
import com.e_learning.project.dto.ChapterResponse;
import com.e_learning.project.dto.PageResponse;
import com.e_learning.project.model.ChapterEntity;
import com.e_learning.project.model.CourseEntity;
import com.e_learning.project.model.SectionEntity;
import com.e_learning.project.exception.ResourceNotFoundException;
import com.e_learning.project.repository.ChapterRepository;
import com.e_learning.project.repository.CourseRepository;
import com.e_learning.project.repository.SectionRepository;
import com.e_learning.project.util.Filters;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class ChapterService {

    private final ChapterRepository chapterRepository;
    private final CourseRepository courseRepository;
    private final SectionRepository sectionRepository;
    private final AccessControlService accessControl;

    public ChapterService(ChapterRepository chapterRepository,
                          CourseRepository courseRepository,
                          SectionRepository sectionRepository,
                          AccessControlService accessControl) {
        this.chapterRepository = chapterRepository;
        this.courseRepository = courseRepository;
        this.sectionRepository = sectionRepository;
        this.accessControl = accessControl;
    }

    // Résout des noms de sections en entités de la classe donnée (inconnus ignorés).
    private List<SectionEntity> resolveSections(UUID classId, List<String> names) {
        if (names == null || names.isEmpty()) return List.of();
        return sectionRepository.findByClassEntityIdAndNameIn(classId, names);
    }

    // CREATE
    public ChapterResponse create(UUID courseId, ChapterRequest request) {

        CourseEntity course = courseRepository.findById(courseId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Course introuvable : " + courseId));

        ChapterEntity chapter = new ChapterEntity();
        chapter.setTitle(request.getTitle());
        chapter.setDescription(request.getDescription());
        chapter.setChapterOrder(request.getChapterOrder());
        chapter.setCourse(course);
        chapter.getSections().addAll(resolveSections(course.getClassEntity().getId(), request.getSections()));

        return new ChapterResponse(chapterRepository.save(chapter));
    }

    // LIST
    @Transactional(readOnly = true)
    public PageResponse<ChapterResponse> getByCourse(UUID courseId, String search, Pageable pageable) {
        CourseEntity course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course introuvable : " + courseId));
        accessControl.checkCourseAccess(course);
        SectionEntity section = accessControl.currentSectionFilter();
        return PageResponse.from(
                chapterRepository.searchByCourse(courseId, Filters.likePattern(search), section, pageable)
                        .map(ChapterResponse::new));
    }

    // GET
    @Transactional(readOnly = true)
    public ChapterResponse getById(UUID id) {
        ChapterEntity chapter = chapterRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Chapter introuvable : " + id));
        accessControl.checkChapterAccess(chapter);
        ChapterResponse response = new ChapterResponse(chapter);
        // Verrou côté front : l'étudiant voit le programme mais ne lit le contenu
        // que si un abonnement actif couvre la classe (admin = toujours ouvert).
        response.setAccessGranted(accessControl.canPlayClass(chapter.getCourse().getClassEntity().getId()));
        return response;
    }

    // UPDATE
    public ChapterResponse update(UUID id, ChapterRequest request) {
        ChapterEntity chapter = chapterRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Chapter introuvable : " + id));

        chapter.setTitle(request.getTitle());
        chapter.setDescription(request.getDescription());
        chapter.setChapterOrder(request.getChapterOrder());
        chapter.getSections().clear();
        chapter.getSections().addAll(resolveSections(chapter.getCourse().getClassEntity().getId(), request.getSections()));

        return new ChapterResponse(chapterRepository.save(chapter));
    }

    // DELETE
    public void delete(UUID id) {
        if (!chapterRepository.existsById(id)) {
            throw new ResourceNotFoundException("Chapter introuvable : " + id);
        }
        chapterRepository.deleteById(id);
    }
}