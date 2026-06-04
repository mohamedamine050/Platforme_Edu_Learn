package com.e_learning.project.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ChapterRequest {

    @NotBlank(message = "Le titre est obligatoire")
    private String title;

    private String description;

    @NotNull(message = "L'ordre du chapitre est obligatoire")
    private Integer chapterOrder;

    // Sections ciblées (noms). Vide/absent = chapitre commun à toutes les sections.
    private List<String> sections;
}