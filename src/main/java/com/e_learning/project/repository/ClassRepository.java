package com.e_learning.project.repository;

import com.e_learning.project.model.Class;
import org.springframework.data.jpa.repository.JpaRepository;

// ✅ @Repository retiré : inutile, JpaRepository l'enregistre automatiquement
public interface ClassRepository extends JpaRepository<Class, Long> {
}