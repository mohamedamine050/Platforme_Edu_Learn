package com.e_learning.project.controller;

import com.e_learning.project.dto.CourseRequest;
import com.e_learning.project.dto.CourseResponse;
import com.e_learning.project.service.CourseService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
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
    public ResponseEntity<CourseResponse> create(@PathVariable Long classId,
                                                 @Valid @RequestBody CourseRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(courseService.create(classId, request));
    }

    // LIST by class
    @GetMapping("/classes/{classId}/courses")
    public List<CourseResponse> getByClass(@PathVariable Long classId) {
        return courseService.getByClass(classId);
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
    public void delete(@PathVariable UUID id) {
        courseService.delete(id);
    }
}