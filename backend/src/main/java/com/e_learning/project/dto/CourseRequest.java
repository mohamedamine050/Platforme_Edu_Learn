package com.e_learning.project.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class CourseRequest {

    @NotBlank(message = "Le titre est obligatoire")
    private String title;

    private String description;

    // Sections ciblées (noms). Vide/absent = matière commune à toutes les sections.
    private List<String> sections;
}