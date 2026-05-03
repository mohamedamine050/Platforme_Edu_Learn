package com.e_learning.project.controller;

import com.e_learning.project.dto.ClassRequest;
import com.e_learning.project.dto.ClassResponse;
import com.e_learning.project.service.ClassService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ClassController {

    private final ClassService classService;

    public ClassController(ClassService classService) {
        this.classService = classService;
    }

    // CREATE
    @PostMapping("/classes")
    public ResponseEntity<ClassResponse> create(@Valid @RequestBody ClassRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(classService.create(request));
    }

    // LIST
    @GetMapping("/classes")
    public List<ClassResponse> getAll() {
        return classService.getAll();
    }

    // GET
    @GetMapping("/classes/{id}")
    public ClassResponse getById(@PathVariable Long id) {
        return classService.getById(id);
    }

    // UPDATE
    @PutMapping("/classes/{id}")
    public ClassResponse update(@PathVariable Long id,
                                @Valid @RequestBody ClassRequest request) {
        return classService.update(id, request);
    }

    // DELETE
    @DeleteMapping("/classes/{id}")
    public void delete(@PathVariable Long id) {
        classService.delete(id);
    }
}