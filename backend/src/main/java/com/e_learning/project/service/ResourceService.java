package com.e_learning.project.service;

import com.e_learning.project.dto.PageResponse;
import com.e_learning.project.dto.ResourceRequest;
import com.e_learning.project.dto.ResourceResponse;
import com.e_learning.project.exception.ResourceNotFoundException;
import com.e_learning.project.model.ChapterEntity;
import com.e_learning.project.model.ResourceEntity;
import com.e_learning.project.repository.ChapterRepository;
import com.e_learning.project.repository.ResourceRepository;
import com.e_learning.project.util.Filters;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@Transactional
public class ResourceService {

    private final ResourceRepository resourceRepository;
    private final ChapterRepository chapterRepository;
    private final AccessControlService accessControl;

    public ResourceService(ResourceRepository resourceRepository,
                           ChapterRepository chapterRepository,
                           AccessControlService accessControl) {
        this.resourceRepository = resourceRepository;
        this.chapterRepository = chapterRepository;
        this.accessControl = accessControl;
    }

    public ResourceResponse create(UUID chapterId, ResourceRequest request) {
        ChapterEntity chapter = chapterRepository.findById(chapterId)
                .orElseThrow(() -> new ResourceNotFoundException("Chapter introuvable : " + chapterId));

        ResourceEntity resource = new ResourceEntity();
        resource.setName(request.getName());
        resource.setFileUrl(request.getFileUrl());
        resource.setChapter(chapter);

        return new ResourceResponse(resourceRepository.save(resource));
    }

    @Transactional(readOnly = true)
    public PageResponse<ResourceResponse> getByChapter(UUID chapterId, String search, Pageable pageable) {
        ChapterEntity chapter = chapterRepository.findById(chapterId)
                .orElseThrow(() -> new ResourceNotFoundException("Chapter introuvable : " + chapterId));
        accessControl.checkChapterAccess(chapter);
        return PageResponse.from(
                resourceRepository.searchByChapter(chapterId, Filters.likePattern(search), pageable)
                        .map(ResourceResponse::new));
    }

    @Transactional(readOnly = true)
    public ResourceResponse getById(UUID id) {
        ResourceEntity resource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ressource introuvable : " + id));
        accessControl.checkChapterAccess(resource.getChapter());
        return new ResourceResponse(resource);
    }

    public ResourceResponse update(UUID id, ResourceRequest request) {
        ResourceEntity resource = resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ressource introuvable : " + id));
        resource.setName(request.getName());
        resource.setFileUrl(request.getFileUrl());
        return new ResourceResponse(resourceRepository.save(resource));
    }

    public void delete(UUID id) {
        if (!resourceRepository.existsById(id)) {
            throw new ResourceNotFoundException("Ressource introuvable : " + id);
        }
        resourceRepository.deleteById(id);
    }
}
