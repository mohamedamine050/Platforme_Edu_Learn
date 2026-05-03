package com.e_learning.project.controller;

import com.e_learning.project.dto.ChapterRequest;
import com.e_learning.project.dto.ChapterResponse;
import com.e_learning.project.service.ChapterService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class ChapterController {

    private final ChapterService chapterService;

    public ChapterController(ChapterService chapterService) {
        this.chapterService = chapterService;
    }

    @PostMapping("/courses/{courseId}/chapters")
    public ResponseEntity<ChapterResponse> create(@PathVariable UUID courseId,
                                                  @Valid @RequestBody ChapterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(chapterService.create(courseId, request));
    }

    @GetMapping("/courses/{courseId}/chapters")
    public List<ChapterResponse> getByCourse(@PathVariable UUID courseId) {
        return chapterService.getByCourse(courseId);
    }

    @GetMapping("/chapters/{id}")
    public ChapterResponse getById(@PathVariable UUID id) {
        return chapterService.getById(id);
    }

    @PutMapping("/chapters/{id}")
    public ChapterResponse update(@PathVariable UUID id,
                                  @Valid @RequestBody ChapterRequest request) {
        return chapterService.update(id, request);
    }

    @DeleteMapping("/chapters/{id}")
    public void delete(@PathVariable UUID id) {
        chapterService.delete(id);
    }
}