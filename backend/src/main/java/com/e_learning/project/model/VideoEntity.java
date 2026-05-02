package com.e_learning.project.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "videos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VideoEntity {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String videoUrl;

    @Column(nullable = false)
    private Integer videoOrder;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // 🔥 relation obligatoire vers Chapter
    @ManyToOne
    @JoinColumn(name = "chapter_id", nullable = false)
    private ChapterEntity chapter;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}