package com.e_learning.project.dto;

import com.e_learning.project.model.ChapterEntity;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
public class ChapterResponse {

    private UUID id;
    private String title;
    private String description;
    private Integer chapterOrder;
    private LocalDateTime createdAt;

    public ChapterResponse(ChapterEntity entity) {
        this.id = entity.getId();
        this.title = entity.getTitle();
        this.description = entity.getDescription();
        this.chapterOrder = entity.getChapterOrder();
        this.createdAt = entity.getCreatedAt();
    }
}