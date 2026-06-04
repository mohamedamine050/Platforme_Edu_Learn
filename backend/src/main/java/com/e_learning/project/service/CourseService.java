package com.e_learning.project.service;

import com.e_learning.project.dto.CourseRequest;
import com.e_learning.project.dto.CourseResponse;
import com.e_learning.project.dto.PageResponse;
import com.e_learning.project.model.ClassEntity;
import com.e_learning.project.model.CourseEntity;
import com.e_learning.project.model.SectionEntity;
import com.e_learning.project.exception.ResourceNotFoundException;
import com.e_learning.project.repository.ClassRepository;
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
public class CourseService {

    private final CourseRepository courseRepository;
    private final ClassRepository classRepository;
    private final SectionRepository sectionRepository;
    private final AccessControlService accessControl;

    public CourseService(CourseRepository courseRepository,
                         ClassRepository classRepository,
                         SectionRepository sectionRepository,
                         AccessControlService accessControl) {
        this.courseRepository = courseRepository;
        this.classRepository = classRepository;
        this.sectionRepository = sectionRepository;
        this.accessControl = accessControl;
    }

    // Résout des noms de sections en entités appartenant à la classe donnée (les inconnus sont ignorés).
    private List<SectionEntity> resolveSections(UUID classId, List<String> names) {
        if (names == null || names.isEmpty()) return List.of();
        return sectionRepository.findByClassEntityIdAndNameIn(classId, names);
    }

    // CREATE course linked to class
    public CourseResponse create(UUID classId, CourseRequest request) {

        ClassEntity classEntity = classRepository.findById(classId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Classe introuvable : " + classId));

        CourseEntity course = new CourseEntity();
        course.setTitle(request.getTitle());
        course.setDescription(request.getDescription());
        course.setClassEntity(classEntity);
        course.getSections().addAll(resolveSections(classId, request.getSections()));

        return new CourseResponse(courseRepository.save(course));
    }

    // LIST courses by class
    @Transactional(readOnly = true)
    public PageResponse<CourseResponse> getByClass(UUID classId, String search, Pageable pageable) {
        accessControl.checkClassAccess(classId);
        SectionEntity section = accessControl.currentSectionFilter();
        return PageResponse.from(
                courseRepository.searchByClass(classId, Filters.likePattern(search), section, pageable)
                        .map(CourseResponse::new));
    }

    // GET by id
    @Transactional(readOnly = true)
    public CourseResponse getById(UUID id) {
        CourseEntity course = courseRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Course introuvable : " + id));
        accessControl.checkCourseAccess(course);
        return new CourseResponse(course);
    }

    // UPDATE
    public CourseResponse update(UUID id, CourseRequest request) {
        CourseEntity course = courseRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Course introuvable : " + id));

        course.setTitle(request.getTitle());
        course.setDescription(request.getDescription());
        course.getSections().clear();
        course.getSections().addAll(resolveSections(course.getClassEntity().getId(), request.getSections()));

        return new CourseResponse(courseRepository.save(course));
    }

    // DELETE
    public void delete(UUID id) {
        if (!courseRepository.existsById(id)) {
            throw new ResourceNotFoundException("Course introuvable : " + id);
        }
        courseRepository.deleteById(id);
    }
}
