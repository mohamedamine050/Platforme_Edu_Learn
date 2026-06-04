package com.e_learning.project.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ForgotPasswordRequest {

    @NotBlank(message = "L'email est obligatoire")
    @Email(message = "Email invalide")
    private String email;
}
