package com.e_learning.project.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResourceRequest {

    @NotBlank(message = "Le nom est obligatoire")
    private String name;

    @NotBlank(message = "Le lien du document est obligatoire")
    private String fileUrl;
}
