package com.e_learning.project.repository;

import com.e_learning.project.model.VideoEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface VideoRepository extends JpaRepository<VideoEntity, UUID> {

    List<VideoEntity> findByChapterId(UUID chapterId);
}