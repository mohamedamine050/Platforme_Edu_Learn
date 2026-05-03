package com.e_learning.project.dto;

import com.e_learning.project.model.Class;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class ClassResponse {

    private Long id;
    private String title;
    private String level;
    private LocalDateTime createdAt;

    // Mapping Entity → DTO
    public ClassResponse(Class entity) {
        this.id = entity.getId();
        this.title = entity.getTitle();
        this.level = entity.getLevel();
        this.createdAt = entity.getCreatedAt();
    }
}