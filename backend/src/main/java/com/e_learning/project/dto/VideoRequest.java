package com.e_learning.project.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VideoRequest {

    private String title;
    private String description;
    private String videoUrl;
    private Integer videoOrder;
}