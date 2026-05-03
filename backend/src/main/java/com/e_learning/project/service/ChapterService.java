package com.e_learning.project.service;

import com.e_learning.project.dto.ChapterRequest;
import com.e_learning.project.dto.ChapterResponse;
import com.e_learning.project.model.ChapterEntity;
import com.e_learning.project.model.CourseEntity;
import com.e_learning.project.exception.ResourceNotFoundException;
import com.e_learning.project.repository.ChapterRepository;
import com.e_learning.project.repository.CourseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class ChapterService {

    private final ChapterRepository chapterRepository;
    private final CourseRepository courseRepository;

    public ChapterService(ChapterRepository chapterRepository,
                          CourseRepository courseRepository) {
        this.chapterRepository = chapterRepository;
        this.courseRepository = courseRepository;
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

        return new ChapterResponse(chapterRepository.save(chapter));
    }

    // LIST
    @Transactional(readOnly = true)
    public List<ChapterResponse> getByCourse(UUID courseId) {
        return chapterRepository.findByCourseId(courseId)
                .stream()
                .map(ChapterResponse::new)
                .toList();
    }

    // GET
    @Transactional(readOnly = true)
    public ChapterResponse getById(UUID id) {
        return chapterRepository.findById(id)
                .map(ChapterResponse::new)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Chapter introuvable : " + id));
    }

    // UPDATE
    public ChapterResponse update(UUID id, ChapterRequest request) {
        ChapterEntity chapter = chapterRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Chapter introuvable : " + id));

        chapter.setTitle(request.getTitle());
        chapter.setDescription(request.getDescription());
        chapter.setChapterOrder(request.getChapterOrder());

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