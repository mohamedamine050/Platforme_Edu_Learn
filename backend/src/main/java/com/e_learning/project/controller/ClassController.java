package com.e_learning.project.controller;

import com.e_learning.project.dto.ClassRequest;
import com.e_learning.project.dto.ClassResponse;
import com.e_learning.project.dto.OfferResponse;
import com.e_learning.project.dto.PageResponse;
import com.e_learning.project.enums.Level;
import com.e_learning.project.service.ClassService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.List;
import java.util.UUID;

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

    // LIST paginée (query params : ?level=&search=&page=&size=&sort=title,asc)
    @GetMapping("/classes")
    public PageResponse<ClassResponse> getAll(
            @RequestParam(required = false) Level level,
            @RequestParam(required = false) String search,
            @PageableDefault(size = 10, sort = "title") Pageable pageable) {
        return classService.getAll(level, search, pageable);
    }

    // LIST publique allégée pour la page « Offres » / l'accueil (non paginée, mise en cache navigateur).
    @GetMapping("/classes/offers")
    public ResponseEntity<List<OfferResponse>> getOffers() {
        return ResponseEntity.ok()
                .cacheControl(CacheControl.maxAge(Duration.ofMinutes(10)).cachePublic())
                .body(classService.getOffers());
    }

    // GET
    @GetMapping("/classes/{id}")
    public ClassResponse getById(@PathVariable UUID id) {
        return classService.getById(id);
    }

    // UPDATE
    @PutMapping("/classes/{id}")
    public ClassResponse update(@PathVariable UUID id,
                                @Valid @RequestBody ClassRequest request) {
        return classService.update(id, request);
    }

    // DELETE
    @DeleteMapping("/classes/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        classService.delete(id);
        return ResponseEntity.noContent().build();
    }
}