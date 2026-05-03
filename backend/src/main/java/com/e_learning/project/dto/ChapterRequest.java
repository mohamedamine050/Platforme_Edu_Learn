package com.e_learning.project.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChapterRequest {

    private String title;
    private String description;
    private Integer chapterOrder;
}