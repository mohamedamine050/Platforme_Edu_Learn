package com.e_learning.project.controller;

import com.e_learning.project.dto.CourseRequest;
import com.e_learning.project.dto.CourseResponse;
import com.e_learning.project.dto.PageResponse;
import com.e_learning.project.service.CourseService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api")
public class CourseController {

    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    // CREATE
    @PostMapping("/classes/{classId}/courses")
    public ResponseEntity<CourseResponse> create(@PathVariable UUID classId,
                                                 @Valid @RequestBody CourseRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(courseService.create(classId, request));
    }

    // LIST paginée par classe (query params : ?search=&page=&size=&sort=title,asc)
    @GetMapping("/classes/{classId}/courses")
    public PageResponse<CourseResponse> getByClass(@PathVariable UUID classId,
                                                   @RequestParam(required = false) String search,
                                                   @PageableDefault(size = 10, sort = "title") Pageable pageable) {
        return courseService.getByClass(classId, search, pageable);
    }

    // GET by id
    @GetMapping("/courses/{id}")
    public CourseResponse getById(@PathVariable UUID id) {
        return courseService.getById(id);
    }

    // UPDATE
    @PutMapping("/courses/{id}")
    public CourseResponse update(@PathVariable UUID id,
                                 @Valid @RequestBody CourseRequest request) {
        return courseService.update(id, request);
    }

    // DELETE
    @DeleteMapping("/courses/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        courseService.delete(id);
        return ResponseEntity.noContent().build();
    }
}