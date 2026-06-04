package com.e_learning.project.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "resources")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResourceEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    // URL complète du document (Google Drive, lien direct…). Multi-fournisseur,
    // cohérent avec VideoEntity.videoUrl (on ne se verrouille pas à un seul hébergeur).
    @Column(nullable = false, columnDefinition = "TEXT")
    private String fileUrl;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chapter_id", nullable = false)
    private ChapterEntity chapter;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}
