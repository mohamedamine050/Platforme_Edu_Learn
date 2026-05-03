package com.e_learning.project.dto;

import com.e_learning.project.model.VideoEntity;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
public class VideoResponse {

    private UUID id;
    private String title;
    private String description;
    private String videoUrl;
    private Integer videoOrder;
    private LocalDateTime createdAt;

    public VideoResponse(VideoEntity entity) {
        this.id = entity.getId();
        this.title = entity.getTitle();
        this.description = entity.getDescription();
        this.videoUrl = entity.getVideoUrl();
        this.videoOrder = entity.getVideoOrder();
        this.createdAt = entity.getCreatedAt();
    }
}