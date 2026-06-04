package com.e_learning.project.repository;

import com.e_learning.project.model.ChapterEntity;
import com.e_learning.project.model.SectionEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.UUID;

public interface ChapterRepository extends JpaRepository<ChapterEntity, UUID> {

    @Query("""
            SELECT ch FROM ChapterEntity ch
            WHERE ch.course.id = :courseId
              AND (:search IS NULL OR LOWER(ch.title) LIKE :search)
              AND (:section IS NULL OR ch.sections IS EMPTY OR :section MEMBER OF ch.sections)
            """)
    Page<ChapterEntity> searchByCourse(@Param("courseId") UUID courseId,
                                       @Param("search") String search,
                                       @Param("section") SectionEntity section,
                                       Pageable pageable);

    // Vrai si au moins un chapitre cible cette section.
    @Query("SELECT COUNT(ch) > 0 FROM ChapterEntity ch JOIN ch.sections s WHERE s.id = :sectionId")
    boolean isSectionTargeted(@Param("sectionId") UUID sectionId);
}
