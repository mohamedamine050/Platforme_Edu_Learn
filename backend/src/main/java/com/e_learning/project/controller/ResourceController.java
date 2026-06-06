package com.e_learning.project.controller;

import com.e_learning.project.config.AccessChecker;
import com.e_learning.project.dto.PageResponse;
import com.e_learning.project.dto.ResourceRequest;
import com.e_learning.project.dto.ResourceResponse;
import com.e_learning.project.service.ResourceService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api")
public class ResourceController {

    private final ResourceService resourceService;
    private final AccessChecker accessChecker;

    public ResourceController(ResourceService resourceService, AccessChecker accessChecker) {
        this.resourceService = resourceService;
        this.accessChecker = accessChecker;
    }

    // CREATE
    @PostMapping("/chapters/{chapterId}/resources")
    public ResponseEntity<ResourceResponse> create(@PathVariable UUID chapterId,
                                                    @Valid @RequestBody ResourceRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(resourceService.create(chapterId, request));
    }

    // LIST paginée par chapitre (query params : ?search=&page=&size=&sort=name,asc)
    // Noms visibles, mais URL du fichier masquée si l'accès n'est pas accordé.
    @GetMapping("/chapters/{chapterId}/resources")
    public PageResponse<ResourceResponse> getByChapter(@PathVariable UUID chapterId,
                                                       @RequestParam(required = false) String search,
                                                       @PageableDefault(size = 10, sort = "name") Pageable pageable) {
        PageResponse<ResourceResponse> result = resourceService.getByChapter(chapterId, search, pageable);
        if (!accessChecker.canViewChapter(chapterId)) {
            result.content().forEach(ResourceResponse::hideUrl);
        }
        return result;
    }

    // GET d'un document complet (URL incluse) : réservé aux accès accordés.
    @GetMapping("/resources/{id}")
    @PreAuthorize("@accessChecker.canViewResource(#id)")
    public ResourceResponse getById(@PathVariable UUID id) {
        return resourceService.getById(id);
    }

    // UPDATE
    @PutMapping("/resources/{id}")
    public ResourceResponse update(@PathVariable UUID id,
                                   @Valid @RequestBody ResourceRequest request) {
        return resourceService.update(id, request);
    }

    // DELETE
    @DeleteMapping("/resources/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        resourceService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
