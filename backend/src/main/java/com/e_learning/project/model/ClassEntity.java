package com.e_learning.project.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "classes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClassEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String level;

    // Prix de la classe (en monnaie locale). BigDecimal : jamais de double pour de l'argent.
    // columnDefinition avec "default 0" pour que l'ajout de colonne fonctionne sur les lignes existantes.
    @Column(nullable = false, columnDefinition = "numeric(10,2) default 0")
    @Builder.Default
    private BigDecimal price = BigDecimal.ZERO;

    // Sections de la classe (entités). Cascade : créer/supprimer une classe gère ses sections.
    @OneToMany(mappedBy = "classEntity", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<SectionEntity> sections = new ArrayList<>();

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "classEntity", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<CourseEntity> courses = new ArrayList<>();

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}
