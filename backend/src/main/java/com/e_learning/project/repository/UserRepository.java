package com.e_learning.project.repository;

import com.e_learning.project.model.UserEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<UserEntity, UUID> {
	boolean existsByEmailIgnoreCase(String email);
	Optional<UserEntity> findByEmailIgnoreCase(String email);

	@Query("""
			SELECT u FROM UserEntity u
			WHERE (:search IS NULL
			       OR LOWER(u.firstName) LIKE :search
			       OR LOWER(u.lastName)  LIKE :search
			       OR LOWER(u.email)     LIKE :search)
			""")
	Page<UserEntity> search(@Param("search") String search, Pageable pageable);

	@Query("""
			SELECT u FROM UserEntity u
			WHERE TYPE(u) = :type
			  AND (:search IS NULL
			       OR LOWER(u.firstName) LIKE :search
			       OR LOWER(u.lastName)  LIKE :search
			       OR LOWER(u.email)     LIKE :search)
			""")
	Page<UserEntity> searchByType(@Param("type") Class<? extends UserEntity> type,
	                              @Param("search") String search,
	                              Pageable pageable);

	// Vrai si au moins un étudiant est rattaché à cette section
	// (intégrité : on n'autorise pas sa suppression tant qu'elle est utilisée).
	@Query("SELECT COUNT(s) > 0 FROM StudentEntity s WHERE s.section.id = :sectionId")
	boolean existsStudentInSection(@Param("sectionId") UUID sectionId);

	@Query("""
			SELECT DISTINCT s.establishment FROM StudentEntity s
			WHERE s.establishment IS NOT NULL AND s.establishment <> ''
			ORDER BY s.establishment
			""")
	List<String> findDistinctEstablishments();

	@Query("""
			SELECT DISTINCT s.region FROM StudentEntity s
			WHERE s.region IS NOT NULL AND s.region <> ''
			ORDER BY s.region
			""")
	List<String> findDistinctRegions();
}
