package com.e_learning.project.util;

public final class Filters {

    private Filters() {
    }

    /** Retourne null si la valeur est nulle ou vide après trim (pour neutraliser un query param vide). */
    public static String trimToNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    /**
     * Construit un motif LIKE insensible à la casse ("%valeur%") ou null si la recherche est vide.
     * Le motif est destiné à un "LOWER(colonne) LIKE :pattern" (le motif est déjà en minuscules).
     */
    public static String likePattern(String value) {
        String trimmed = trimToNull(value);
        return trimmed == null ? null : "%" + trimmed.toLowerCase() + "%";
    }
}
