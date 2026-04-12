package com.e_learning.project.dto;

import com.e_learning.project.enums.Level;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ClassRequest {

    @NotBlank(message = "Le titre est obligatoire")
    private String title;

    @NotNull(message = "Le niveau est obligatoire")
    private Level level;
}