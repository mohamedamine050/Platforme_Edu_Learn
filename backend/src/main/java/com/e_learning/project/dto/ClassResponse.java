package com.e_learning.project.dto;

import com.e_learning.project.model.ClassEntity;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Getter
public class ClassResponse {

    private UUID id;
    private String title;
    private String level;
    private BigDecimal price;
    private List<SectionResponse> sections;
    private LocalDateTime createdAt;

    public ClassResponse(ClassEntity entity) {
        this.id = entity.getId();
        this.title = entity.getTitle();
        this.level = entity.getLevel();
        this.price = entity.getPrice();
        this.sections = entity.getSections().stream().map(SectionResponse::new).toList();
        this.createdAt = entity.getCreatedAt();
    }
}