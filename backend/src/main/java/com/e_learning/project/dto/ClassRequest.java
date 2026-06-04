package com.e_learning.project.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;

import java.math.BigDecimal;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ClassRequest {

    @NotBlank(message = "Le titre est obligatoire")
    private String title;

    @NotBlank(message = "Le niveau est obligatoire")
    private String level;

    // Prix de la classe (optionnel ; 0 par défaut). Doit être positif ou nul.
    @PositiveOrZero(message = "Le prix doit être positif ou nul")
    private BigDecimal price;

    // Sections de la classe (optionnelles), chacune avec son propre prix.
    @Valid
    private List<SectionRequest> sections;
}