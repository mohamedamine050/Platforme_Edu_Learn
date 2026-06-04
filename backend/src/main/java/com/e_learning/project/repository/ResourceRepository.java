package com.e_learning.project.repository;

import com.e_learning.project.model.ResourceEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.UUID;

public interface ResourceRepository extends JpaRepository<ResourceEntity, UUID> {

    @Query("""
            SELECT r FROM ResourceEntity r
            WHERE r.chapter.id = :chapterId
              AND (:search IS NULL OR LOWER(r.name) LIKE :search)
            """)
    Page<ResourceEntity> searchByChapter(@Param("chapterId") UUID chapterId, @Param("search") String search, Pageable pageable);
}
