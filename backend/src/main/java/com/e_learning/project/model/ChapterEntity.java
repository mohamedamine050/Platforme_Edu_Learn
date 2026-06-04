package com.e_learning.project.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.UUID;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "chapters")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChapterEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private Integer chapterOrder;

    // Sections (de la classe du cours) auxquelles ce chapitre est destiné.
    // Vide = chapitre commun, visible par TOUTES les sections de la classe.
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "chapter_section",
            joinColumns = @JoinColumn(name = "chapter_id"),
            inverseJoinColumns = @JoinColumn(name = "section_id"))
    @Builder.Default
    private Set<SectionEntity> sections = new LinkedHashSet<>();

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // Relation obligatoire vers Course (LAZY : chargée à la demande, mappée dans la transaction).
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private CourseEntity course;
    @Builder.Default
    @OneToMany(mappedBy = "chapter", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<VideoEntity> videos = new ArrayList<>();

    @Builder.Default
    @OneToMany(mappedBy = "chapter", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ResourceEntity> resources = new ArrayList<>();

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}