package com.e_learning.project.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserAccessRequest {

    @NotNull(message = "Le champ « granted » est obligatoire")
    private Boolean granted;
}
