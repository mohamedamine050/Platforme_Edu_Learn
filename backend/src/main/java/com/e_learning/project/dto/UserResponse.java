package com.e_learning.project.dto;

import com.e_learning.project.model.UserEntity;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
public class UserResponse {

    private UUID id;
    private String firstName;
    private String lastName;
    private String email;
    private Long phoneNumber;
    private boolean isActive;
    private String role;
    private LocalDateTime createdAt;

    private String level;
    private String gender;
    private java.time.LocalDate dateOfBirth;
    private Long classId;
    private String classTitle;

    public UserResponse(UserEntity entity) {
        this.id = entity.getId();
        this.firstName = entity.getFirstName();
        this.lastName = entity.getLastName();
        this.email = entity.getEmail();
        this.phoneNumber = entity.getPhoneNumber();
        this.isActive = entity.isActive();
        this.role = entity.getRole() != null ? entity.getRole().name() : null;
        this.createdAt = entity.getCreatedAt();
        this.level = entity.getLevel();
        this.gender = entity.getGender() != null ? entity.getGender().name() : null;
        this.dateOfBirth = entity.getDateOfBirth();
        if (entity.getClassEntity() != null) {
            this.classId = entity.getClassEntity().getId();
            this.classTitle = entity.getClassEntity().getTitle();
        }
    }
}
