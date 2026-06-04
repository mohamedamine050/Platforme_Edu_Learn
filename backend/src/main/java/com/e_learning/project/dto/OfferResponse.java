package com.e_learning.project.dto;

import com.e_learning.project.model.ClassEntity;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

/**
 * Vue publique allégée pour la page « Offres » / l'accueil : uniquement ce qui
 * est affiché (pas de createdAt, ni de relations cours/chapitres). Non paginé.
 */
public record OfferResponse(
        UUID id,
        String title,
        String level,
        BigDecimal price,
        List<OfferSection> sections
) {
    public record OfferSection(String name, BigDecimal price) {}

    public static OfferResponse from(ClassEntity c) {
        List<OfferSection> sections = c.getSections().stream()
                .map(s -> new OfferSection(s.getName(), s.getPrice()))
                .toList();
        return new OfferResponse(c.getId(), c.getTitle(), c.getLevel(), c.getPrice(), sections);
    }
}
