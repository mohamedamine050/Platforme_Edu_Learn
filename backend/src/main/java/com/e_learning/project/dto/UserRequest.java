package com.e_learning.project.dto;

import com.e_learning.project.enums.Role;
import com.e_learning.project.enums.Gender;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserRequest {

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

    @NotNull(message = "Le statut actif est obligatoire")
    private Boolean isActive;

    @NotNull(message = "Le role est obligatoire")
    private Role role;

    // Champs spécifiques aux étudiants : obligatoires uniquement si role == STUDENT
    // (validés dans UserService selon le rôle).
    private String level;

    private String section;

    private String establishment;

    private String region;

    private Gender gender;

    private java.time.LocalDate dateOfBirth;

    private UUID classId;
}
