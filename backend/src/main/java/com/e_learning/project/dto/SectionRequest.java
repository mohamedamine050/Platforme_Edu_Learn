package com.e_learning.project.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class SectionRequest {

    @NotBlank(message = "Le nom de la section est obligatoire")
    private String name;

    // Prix de la section (optionnel ; 0 par défaut). Positif ou nul.
    @PositiveOrZero(message = "Le prix doit être positif ou nul")
    private BigDecimal price;
}
