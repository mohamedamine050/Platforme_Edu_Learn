package com.e_learning.project.model;

import com.e_learning.project.enums.Gender;
import com.e_learning.project.enums.Role;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;

@Entity
@Table(name = "students")
@DiscriminatorValue("STUDENT")
@Getter
@Setter
@NoArgsConstructor
@SuperBuilder
public class StudentEntity extends UserEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "class_id", nullable = false)
    private ClassEntity classEntity;

    @Column
    private String level;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "section_id")
    private SectionEntity section;

    @Column(nullable = false)
    private String establishment; // Lycée Pilote, Lycée Bourguiba...

    @Column(nullable = false)
    private String region; // Tunis, Sfax, Sousse...

    @Enumerated(EnumType.STRING)
    @Column
    private Gender gender;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Override
    public Role getRole() {
        return Role.STUDENT;
    }
}
