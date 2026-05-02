package com.e_learning.project.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
        info = @Info(
                title = "E-Learning Project API",
                version = "1.0",
                description = "API documentation for testing project endpoints",
                contact = @Contact(name = "E-Learning Team")
        )
)
public class OpenApiConfig {
}