package com.e_learning.project.repository;

import com.e_learning.project.model.ChapterEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ChapterRepository extends JpaRepository<ChapterEntity, UUID> {

    List<ChapterEntity> findByCourseId(UUID courseId);
}