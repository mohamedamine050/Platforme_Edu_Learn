package com.e_learning.project.repository;

import com.e_learning.project.model.ClassEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface ClassRepository extends JpaRepository<ClassEntity, UUID> {

    boolean existsByTitleAndLevel(String title, String level);

    @Query("""
            SELECT c FROM ClassEntity c
            WHERE (:level IS NULL OR c.level = :level)
              AND (:search IS NULL OR LOWER(c.title) LIKE :search)
            """)
    Page<ClassEntity> search(@Param("level") String level, @Param("search") String search, Pageable pageable);

    // Page « Offres » : toutes les classes + leurs sections en une seule requête
    // (LEFT JOIN FETCH = pas de N+1 ; DISTINCT car la jointure duplique les classes).
    @Query("""
            SELECT DISTINCT c FROM ClassEntity c
            LEFT JOIN FETCH c.sections
            ORDER BY c.level, c.title
            """)
    List<ClassEntity> findAllWithSections();
}
