package com.e_learning.project.controller;

import com.e_learning.project.dto.VideoRequest;
import com.e_learning.project.dto.VideoResponse;
import com.e_learning.project.service.VideoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class VideoController {

    private final VideoService videoService;

    public VideoController(VideoService videoService) {
        this.videoService = videoService;
    }

    // CREATE
    @PostMapping("/chapters/{chapterId}/videos")
    public ResponseEntity<VideoResponse> create(@PathVariable UUID chapterId,
                                                @Valid @RequestBody VideoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(videoService.create(chapterId, request));
    }

    // LIST
    @GetMapping("/chapters/{chapterId}/videos")
    public List<VideoResponse> getByChapter(@PathVariable UUID chapterId) {
        return videoService.getByChapter(chapterId);
    }

    // GET
    @GetMapping("/videos/{id}")
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
    public void delete(@PathVariable UUID id) {
        videoService.delete(id);
    }
}