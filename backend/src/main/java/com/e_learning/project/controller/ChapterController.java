package com.e_learning.project.controller;

import com.e_learning.project.dto.ChapterRequest;
import com.e_learning.project.dto.ChapterResponse;
import com.e_learning.project.dto.PageResponse;
import com.e_learning.project.service.ChapterService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    // LIST paginée par cours (query params : ?search=&page=&size=&sort=chapterOrder,asc)
    @GetMapping("/courses/{courseId}/chapters")
    public PageResponse<ChapterResponse> getByCourse(@PathVariable UUID courseId,
                                                     @RequestParam(required = false) String search,
                                                     @PageableDefault(size = 10, sort = "chapterOrder") Pageable pageable) {
        return chapterService.getByCourse(courseId, search, pageable);
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
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        chapterService.delete(id);
        return ResponseEntity.noContent().build();
    }
}