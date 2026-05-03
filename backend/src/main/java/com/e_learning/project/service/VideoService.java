package com.e_learning.project.service;

import com.e_learning.project.dto.VideoRequest;
import com.e_learning.project.dto.VideoResponse;
import com.e_learning.project.model.ChapterEntity;
import com.e_learning.project.model.VideoEntity;
import com.e_learning.project.exception.ResourceNotFoundException;
import com.e_learning.project.repository.ChapterRepository;
import com.e_learning.project.repository.VideoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class VideoService {

    private final VideoRepository videoRepository;
    private final ChapterRepository chapterRepository;

    public VideoService(VideoRepository videoRepository,
                        ChapterRepository chapterRepository) {
        this.videoRepository = videoRepository;
        this.chapterRepository = chapterRepository;
    }

    // CREATE
    public VideoResponse create(UUID chapterId, VideoRequest request) {

        ChapterEntity chapter = chapterRepository.findById(chapterId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Chapter introuvable : " + chapterId));

        VideoEntity video = new VideoEntity();
        video.setTitle(request.getTitle());
        video.setDescription(request.getDescription());
        video.setVideoUrl(request.getVideoUrl());
        video.setVideoOrder(request.getVideoOrder());
        video.setChapter(chapter);

        return new VideoResponse(videoRepository.save(video));
    }

    // LIST
    @Transactional(readOnly = true)
    public List<VideoResponse> getByChapter(UUID chapterId) {
        return videoRepository.findByChapterId(chapterId)
                .stream()
                .map(VideoResponse::new)
                .toList();
    }

    // GET
    @Transactional(readOnly = true)
    public VideoResponse getById(UUID id) {
        return videoRepository.findById(id)
                .map(VideoResponse::new)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Video introuvable : " + id));
    }

    // UPDATE
    public VideoResponse update(UUID id, VideoRequest request) {
        VideoEntity video = videoRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Video introuvable : " + id));

        video.setTitle(request.getTitle());
        video.setDescription(request.getDescription());
        video.setVideoUrl(request.getVideoUrl());
        video.setVideoOrder(request.getVideoOrder());

        return new VideoResponse(videoRepository.save(video));
    }

    // DELETE
    public void delete(UUID id) {
        if (!videoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Video introuvable : " + id);
        }
        videoRepository.deleteById(id);
    }
}