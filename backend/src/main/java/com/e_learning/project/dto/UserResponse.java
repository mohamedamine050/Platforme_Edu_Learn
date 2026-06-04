package com.e_learning.project.dto;

import com.e_learning.project.model.StudentEntity;
import com.e_learning.project.model.UserEntity;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
public class UserResponse {

    private UUID id;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private boolean isActive;
    private boolean accessGranted;
    private String role;
    private LocalDateTime createdAt;

    private String level;
    private String section;
    private String establishment;
    private String region;
    private String gender;
    private java.time.LocalDate dateOfBirth;
    private UUID classId;
    private String classTitle;

    public UserResponse(UserEntity entity) {
        this.id = entity.getId();
        this.firstName = entity.getFirstName();
        this.lastName = entity.getLastName();
        this.email = entity.getEmail();
        this.phoneNumber = entity.getPhoneNumber();
        this.isActive = entity.isActive();
        this.accessGranted = entity.isAccessGranted();
        this.role = entity.getRole() != null ? entity.getRole().name() : null;
        this.createdAt = entity.getCreatedAt();

        if (entity instanceof StudentEntity student) {
            this.level = student.getLevel();
            this.section = student.getSection() != null ? student.getSection().getName() : null;
            this.establishment = student.getEstablishment();
            this.region = student.getRegion();
            this.gender = student.getGender() != null ? student.getGender().name() : null;
            this.dateOfBirth = student.getDateOfBirth();
            if (student.getClassEntity() != null) {
                this.classId = student.getClassEntity().getId();
                this.classTitle = student.getClassEntity().getTitle();
            }
        }
    }

    // Getter explicite annoté : force la clé JSON "isActive" (sinon Lombok la
    // sérialiserait en "active"). On évite ainsi un doublon dans la réponse.
    @JsonProperty("isActive")
    public boolean isActive() {
        return isActive;
    }
}
