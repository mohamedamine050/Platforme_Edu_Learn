package com.e_learning.project.repository;

import com.e_learning.project.model.SectionEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

public interface SectionRepository extends JpaRepository<SectionEntity, UUID> {

    List<SectionEntity> findByClassEntityId(UUID classId);

    List<SectionEntity> findByClassEntityIdAndNameIn(UUID classId, Collection<String> names);
}
