package com.e_learning.project.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.UUID;
import java.util.List;

@Entity
@Table(name = "chapters")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChapterEntity {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private Integer chapterOrder;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // 🔥 relation obligatoire vers Course
    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    private CourseEntity course;
    @Builder.Default
    @OneToMany(mappedBy = "chapter", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<VideoEntity> videos = new ArrayList<>();

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}