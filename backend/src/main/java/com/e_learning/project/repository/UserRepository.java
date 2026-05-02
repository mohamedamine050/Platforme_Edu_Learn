package com.e_learning.project.repository;

import com.e_learning.project.model.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<UserEntity, UUID> {
	boolean existsByEmailIgnoreCase(String email);
	Optional<UserEntity> findByEmailIgnoreCase(String email);
}
