package com.e_learning.project.dto;

import com.e_learning.project.model.SubscriptionEntity;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
public class SubscriptionResponse {

    private final UUID id;
    private final UUID studentId;
    private final UUID classId;
    private final String classTitle;
    private final String classLevel;
    private final LocalDate startDate;
    private final LocalDate endDate;
    private final boolean active;
    private final LocalDateTime createdAt;

    public SubscriptionResponse(SubscriptionEntity entity) {
        this.id = entity.getId();
        this.studentId = entity.getStudent() != null ? entity.getStudent().getId() : null;
        this.startDate = entity.getStartDate();
        this.endDate = entity.getEndDate();
        this.active = entity.isActiveOn(LocalDate.now());
        this.createdAt = entity.getCreatedAt();
        if (entity.getClassEntity() != null) {
            this.classId = entity.getClassEntity().getId();
            this.classTitle = entity.getClassEntity().getTitle();
            this.classLevel = entity.getClassEntity().getLevel();
        } else {
            this.classId = null;
            this.classTitle = null;
            this.classLevel = null;
        }
    }
}
