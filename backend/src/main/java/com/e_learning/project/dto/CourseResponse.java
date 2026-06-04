package com.e_learning.project.dto;
import com.e_learning.project.model.CourseEntity;

import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Getter
public class CourseResponse {

    private UUID id;
    private String title;
    private String description;
    private List<String> sections;
    private UUID classId;
    private String classTitle;
    private String classLevel;
    private LocalDateTime createdAt;

    public CourseResponse(CourseEntity entity) {
        this.id = entity.getId();
        this.title = entity.getTitle();
        this.description = entity.getDescription();
        this.sections = entity.getSections().stream()
                .map(com.e_learning.project.model.SectionEntity::getName).toList();
        this.createdAt = entity.getCreatedAt();
        if (entity.getClassEntity() != null) {
            this.classId = entity.getClassEntity().getId();
            this.classTitle = entity.getClassEntity().getTitle();
            this.classLevel = entity.getClassEntity().getLevel();
        }
    }
}