package com.e_learning.project.config;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            CorsConfigurationSource corsConfigurationSource
    ) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers(
                                "/api/auth/login", "/api/auth/register", "/api/auth/logout",
                                "/api/auth/verify-email", "/api/auth/resend-verification",
                                "/api/auth/forgot-password", "/api/auth/reset-password"
                        ).permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/auth/registration-options").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/classes", "/api/classes/offers").permitAll()
                        .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
                        // Gestion des comptes : réservée aux admins
                        .requestMatchers("/api/users/**").hasRole("ADMIN")
                        // Mutations du contenu : réservées aux admins (la lecture reste ouverte aux étudiants connectés)
                        .requestMatchers(HttpMethod.POST, "/api/classes/**", "/api/courses/**", "/api/chapters/**", "/api/videos/**", "/api/resources/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/classes/**", "/api/courses/**", "/api/chapters/**", "/api/videos/**", "/api/resources/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/classes/**", "/api/courses/**", "/api/chapters/**", "/api/videos/**", "/api/resources/**").hasRole("ADMIN")
                        .anyRequest().authenticated()
                )
                .exceptionHandling(ex -> ex
                        // 401 : non authentifié (cookie absent / invalide)
                        .authenticationEntryPoint((request, response, authEx) ->
                                writeJsonError(response, HttpStatus.UNAUTHORIZED, "Authentification requise"))
                        // 403 : authentifié mais droits insuffisants
                        .accessDeniedHandler((request, response, deniedEx) ->
                                writeJsonError(response, HttpStatus.FORBIDDEN, "Accès refusé"))
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // Réponse d'erreur JSON cohérente avec GlobalExceptionHandler : { "error": "..." }.
    private static void writeJsonError(HttpServletResponse response, HttpStatus status, String message)
            throws IOException {
        response.setStatus(status.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding(StandardCharsets.UTF_8.name());
        response.getWriter().write("{\"error\":\"" + message + "\"}");
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource(
            @Value("${app.cors.allowed-origins}") String allowedOrigins
    ) {
        CorsConfiguration configuration = new CorsConfiguration();
        List<String> origins = List.of(allowedOrigins.split(","))
            .stream()
            .map(String::trim)
            .filter(origin -> !origin.isBlank())
            .toList();
        configuration.setAllowedOriginPatterns(origins);
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*") );
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
