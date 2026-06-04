package com.e_learning.project.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import com.e_learning.project.enums.Gender;
import java.time.LocalDate;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {

    @NotBlank(message = "Le prénom est obligatoire")
    private String firstName;

    @NotBlank(message = "Le nom est obligatoire")
    private String lastName;

    @NotBlank(message = "L'email est obligatoire")
    @Email(message = "Email invalide")
    private String email;

    @NotBlank(message = "Le mot de passe est obligatoire")
    @Size(min = 6, message = "Le mot de passe doit contenir au moins 6 caractères")
    private String password;

    private String phoneNumber;

    private String level;
    private String section;

    @NotBlank(message = "L'établissement est obligatoire")
    private String establishment;

    @NotBlank(message = "La région est obligatoire")
    private String region;

    private Gender gender;
    private LocalDate dateOfBirth;

    @NotNull(message = "La classe est obligatoire")
    private UUID classId;
}
