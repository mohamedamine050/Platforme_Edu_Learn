package com.e_learning.project.repository;

import com.e_learning.project.model.CourseEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface CourseRepository extends JpaRepository<CourseEntity, UUID> {

    List<CourseEntity> findByClassEntityId(Long classId);
}