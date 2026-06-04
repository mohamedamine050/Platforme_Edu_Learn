package com.e_learning.project.repository;

import com.e_learning.project.model.VideoEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.UUID;

public interface VideoRepository extends JpaRepository<VideoEntity, UUID> {

    @Query("""
            SELECT v FROM VideoEntity v
            WHERE v.chapter.id = :chapterId
              AND (:search IS NULL OR LOWER(v.title) LIKE :search)
            """)
    Page<VideoEntity> searchByChapter(@Param("chapterId") UUID chapterId, @Param("search") String search, Pageable pageable);
}
