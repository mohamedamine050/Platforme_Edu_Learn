package com.e_learning.project.dto;

import java.util.List;

/**
 * Valeurs déjà saisies, proposées en auto-complétion dans le formulaire d'inscription.
 * L'utilisateur peut en choisir une ou saisir une nouvelle valeur.
 */
public record RegistrationOptionsResponse(
        List<String> establishments,
        List<String> regions
) {
}
