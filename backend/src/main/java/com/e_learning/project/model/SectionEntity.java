package com.e_learning.project.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(
    name = "sections",
    uniqueConstraints = @UniqueConstraint(name = "uk_section_class_name", columnNames = {"class_id", "name"})
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SectionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    // Prix propre à la section.
    @Column(nullable = false, columnDefinition = "numeric(10,2) default 0")
    @Builder.Default
    private BigDecimal price = BigDecimal.ZERO;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "class_id", nullable = false)
    private ClassEntity classEntity;
}
