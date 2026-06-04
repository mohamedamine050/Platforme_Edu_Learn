package com.e_learning.project.dto;

import org.springframework.data.domain.Page;

import java.util.List;

/**
 * Réponse paginée stable et explicite (évite de sérialiser directement
 * un Page/PageImpl de Spring, dont la structure JSON est instable).
 */
public record PageResponse<T>(
        List<T> content,
        int page,
        int size,
        long totalElements,
        int totalPages,
        boolean first,
        boolean last
) {
    public static <T> PageResponse<T> from(Page<T> page) {
        return new PageResponse<>(
                page.getContent(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isFirst(),
                page.isLast()
        );
    }
}
