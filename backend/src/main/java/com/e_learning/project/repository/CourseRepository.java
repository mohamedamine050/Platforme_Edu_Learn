package com.e_learning.project.repository;

import com.e_learning.project.model.CourseEntity;
import com.e_learning.project.model.SectionEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.UUID;

public interface CourseRepository extends JpaRepository<CourseEntity, UUID> {

    @Query("""
            SELECT c FROM CourseEntity c
            WHERE c.classEntity.id = :classId
              AND (:search IS NULL OR LOWER(c.title) LIKE :search)
              AND (:section IS NULL OR c.sections IS EMPTY OR :section MEMBER OF c.sections)
            """)
    Page<CourseEntity> searchByClass(@Param("classId") UUID classId,
                                     @Param("search") String search,
                                     @Param("section") SectionEntity section,
                                     Pageable pageable);

    // Vrai si au moins un cours cible cette section (intégrité : on n'autorise pas sa suppression).
    @Query("SELECT COUNT(c) > 0 FROM CourseEntity c JOIN c.sections s WHERE s.id = :sectionId")
    boolean isSectionTargeted(@Param("sectionId") UUID sectionId);
}
