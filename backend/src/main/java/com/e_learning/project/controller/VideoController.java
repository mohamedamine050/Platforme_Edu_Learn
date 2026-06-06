package com.e_learning.project.controller;

import com.e_learning.project.config.AccessChecker;
import com.e_learning.project.dto.PageResponse;
import com.e_learning.project.dto.VideoRequest;
import com.e_learning.project.dto.VideoResponse;
import com.e_learning.project.service.VideoService;
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
public class VideoController {

    private final VideoService videoService;
    private final AccessChecker accessChecker;

    public VideoController(VideoService videoService, AccessChecker accessChecker) {
        this.videoService = videoService;
        this.accessChecker = accessChecker;
    }

    // CREATE
    @PostMapping("/chapters/{chapterId}/videos")
    public ResponseEntity<VideoResponse> create(@PathVariable UUID chapterId,
                                                @Valid @RequestBody VideoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(videoService.create(chapterId, request));
    }

    // LIST paginée par chapitre (query params : ?search=&page=&size=&sort=videoOrder,asc)
    // La liste (titres) reste visible, mais l'URL de lecture est masquée aux étudiants
    // dont l'accès n'a pas été accordé (aperçu du programme façon « contenu verrouillé »).
    @GetMapping("/chapters/{chapterId}/videos")
    public PageResponse<VideoResponse> getByChapter(@PathVariable UUID chapterId,
                                                    @RequestParam(required = false) String search,
                                                    @PageableDefault(size = 10, sort = "videoOrder") Pageable pageable) {
        PageResponse<VideoResponse> result = videoService.getByChapter(chapterId, search, pageable);
        if (!accessChecker.canViewChapter(chapterId)) {
            result.content().forEach(VideoResponse::hideUrl);
        }
        return result;
    }

    // GET d'une vidéo complète (URL incluse) : réservé aux accès accordés.
    @GetMapping("/videos/{id}")
    @PreAuthorize("@accessChecker.canViewVideo(#id)")
    public VideoResponse getById(@PathVariable UUID id) {
        return videoService.getById(id);
    }

    // UPDATE
    @PutMapping("/videos/{id}")
    public VideoResponse update(@PathVariable UUID id,
                                @Valid @RequestBody VideoRequest request) {
        return videoService.update(id, request);
    }

    // DELETE
    @DeleteMapping("/videos/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        videoService.delete(id);
        return ResponseEntity.noContent().build();
    }
}