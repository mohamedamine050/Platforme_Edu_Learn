package com.e_learning.project.dto;

import com.e_learning.project.model.SectionEntity;
import lombok.Getter;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
public class SectionResponse {

    private UUID id;
    private String name;
    private BigDecimal price;

    public SectionResponse(SectionEntity entity) {
        this.id = entity.getId();
        this.name = entity.getName();
        this.price = entity.getPrice();
    }
}
