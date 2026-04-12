package com.e_learning.project.service;

import com.e_learning.project.dto.ClassRequest;
import com.e_learning.project.dto.ClassResponse;
import com.e_learning.project.model.Class;
import com.e_learning.project.exception.ResourceNotFoundException;
import com.e_learning.project.repository.ClassRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ClassService {

    private final ClassRepository classRepository;

    public ClassService(ClassRepository classRepository) {
        this.classRepository = classRepository;
    }

    public ClassResponse create(ClassRequest request) {
        Class entity = Class.builder()
                .title(request.getTitle())
                .level(request.getLevel())
                .build();

        Class saved = classRepository.save(entity);
        return new ClassResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<ClassResponse> getAll() {
        return classRepository.findAll()
                .stream()
                .map(ClassResponse::new)
                .toList();
    }

    @Transactional(readOnly = true)
    public ClassResponse getById(Long id) {
        Class entity = classRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Classe non trouvée : " + id));

        return new ClassResponse(entity);
    }

    public ClassResponse update(Long id, ClassRequest request) {
        Class entity = classRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Classe non trouvée : " + id));

        entity.setTitle(request.getTitle());
        entity.setLevel(request.getLevel());

        Class updated = classRepository.save(entity);
        return new ClassResponse(updated);
    }

    public void delete(Long id) {
        if (!classRepository.existsById(id)) {
            throw new ResourceNotFoundException("Classe non trouvée : " + id);
        }
        classRepository.deleteById(id);
    }
}