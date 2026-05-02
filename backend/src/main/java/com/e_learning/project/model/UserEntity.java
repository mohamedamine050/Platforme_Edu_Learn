package com.e_learning.project.model;

import com.e_learning.project.enums.Role;
import com.e_learning.project.enums.Gender;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(name = "phone_number")
    private Long phoneNumber;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private boolean isActive = true;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column
    private String level;

    @Enumerated(EnumType.STRING)
    @Column
    private Gender gender;

    @Column(name = "date_of_birth")
    private java.time.LocalDate dateOfBirth;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "class_id", nullable = false)
    private Class classEntity;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}
