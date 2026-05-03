package com.e_learning.project.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VideoRequest {

    @NotBlank(message = "Le titre est obligatoire")
    private String title;

    private String description;

    @NotBlank(message = "L'URL de la vidéo est obligatoire")
    private String videoUrl;

    @NotNull(message = "L'ordre de la vidéo est obligatoire")
    private Integer videoOrder;
}