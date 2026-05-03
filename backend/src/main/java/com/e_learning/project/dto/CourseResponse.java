package com.e_learning.project.dto;
import com.e_learning.project.model.CourseEntity;

import lombok.Getter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
public class CourseResponse {

    private UUID id;
    private String title;
    private String description;
    private LocalDateTime createdAt;

    public CourseResponse(CourseEntity entity) {
        this.id = entity.getId();
        this.title = entity.getTitle();
        this.description = entity.getDescription();
        this.createdAt = entity.getCreatedAt();
    }
}