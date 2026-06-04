package com.e_learning.project.dto;

import com.e_learning.project.model.ResourceEntity;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
public class ResourceResponse {

    private UUID id;
    private String name;
    private String fileUrl;
    private UUID chapterId;
    private LocalDateTime createdAt;

    public ResourceResponse(ResourceEntity entity) {
        this.id = entity.getId();
        this.name = entity.getName();
        this.fileUrl = entity.getFileUrl();
        this.chapterId = entity.getChapter() != null ? entity.getChapter().getId() : null;
        this.createdAt = entity.getCreatedAt();
    }

    // Masque l'URL du fichier pour un étudiant sans accès (le nom reste visible).
    public void hideUrl() {
        this.fileUrl = null;
    }
}
