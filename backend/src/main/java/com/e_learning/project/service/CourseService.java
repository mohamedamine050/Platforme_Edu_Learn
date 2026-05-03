package com.e_learning.project.service;

import com.e_learning.project.dto.CourseRequest;
import com.e_learning.project.dto.CourseResponse;
import com.e_learning.project.model.Class;
import com.e_learning.project.model.CourseEntity;
import com.e_learning.project.exception.ResourceNotFoundException;
import com.e_learning.project.repository.ClassRepository;
import com.e_learning.project.repository.CourseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class CourseService {

    private final CourseRepository courseRepository;
    private final ClassRepository classRepository;

    public CourseService(CourseRepository courseRepository,
                         ClassRepository classRepository) {
        this.courseRepository = courseRepository;
        this.classRepository = classRepository;
    }

    // CREATE course linked to class
    public CourseResponse create(Long classId, CourseRequest request) {

        Class classEntity = classRepository.findById(classId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Classe introuvable : " + classId));

        CourseEntity course = new CourseEntity();
        course.setTitle(request.getTitle());
        course.setDescription(request.getDescription());
        course.setClassEntity(classEntity);

        return new CourseResponse(courseRepository.save(course));
    }

    // LIST courses by class
    @Transactional(readOnly = true)
    public List<CourseResponse> getByClass(Long classId) {
        return courseRepository.findByClassEntityId(classId)
                .stream()
                .map(CourseResponse::new)
                .toList();
    }

    // GET by id
    @Transactional(readOnly = true)
    public CourseResponse getById(UUID id) {
        return courseRepository.findById(id)
                .map(CourseResponse::new)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Course introuvable : " + id));
    }

    // UPDATE
    public CourseResponse update(UUID id, CourseRequest request) {
        CourseEntity course = courseRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Course introuvable : " + id));

        course.setTitle(request.getTitle());
        course.setDescription(request.getDescription());

        return new CourseResponse(courseRepository.save(course));
    }

    // DELETE
    public void delete(UUID id) {
        courseRepository.deleteById(id);
    }
}
