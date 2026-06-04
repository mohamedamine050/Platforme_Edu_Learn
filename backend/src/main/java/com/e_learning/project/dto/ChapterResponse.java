package com.e_learning.project.dto;

import com.e_learning.project.model.ChapterEntity;
import com.e_learning.project.model.CourseEntity;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Getter
public class ChapterResponse {

    private UUID id;
    private String title;
    private String description;
    private Integer chapterOrder;
    private List<String> sections;
    private UUID courseId;
    private String courseTitle;
    private UUID classId;
    private String classTitle;
    private String classLevel;
    private LocalDateTime createdAt;

    public ChapterResponse(ChapterEntity entity) {
        this.id = entity.getId();
        this.title = entity.getTitle();
        this.description = entity.getDescription();
        this.chapterOrder = entity.getChapterOrder();
        this.sections = entity.getSections().stream()
                .map(com.e_learning.project.model.SectionEntity::getName).toList();
        this.createdAt = entity.getCreatedAt();

        CourseEntity course = entity.getCourse();
        if (course != null) {
            this.courseId = course.getId();
            this.courseTitle = course.getTitle();
            if (course.getClassEntity() != null) {
                this.classId = course.getClassEntity().getId();
                this.classTitle = course.getClassEntity().getTitle();
                this.classLevel = course.getClassEntity().getLevel();
            }
        }
    }
}