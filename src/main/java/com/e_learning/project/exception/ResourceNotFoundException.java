package com.e_learning.project.exception;

// ✅ Exception métier explicite plutôt que RuntimeException générique
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }
}