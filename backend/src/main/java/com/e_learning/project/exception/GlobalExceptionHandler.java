package com.e_learning.project.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.stream.Collectors;

// ✅ Gestion centralisée des erreurs : aucun try/catch dans les controllers
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleNotFound(ResourceNotFoundException ex) {
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", ex.getMessage()));
    }

    @ExceptionHandler(ResourceAlreadyExistsException.class)
    public ResponseEntity<Map<String, String>> handleAlreadyExists(ResourceAlreadyExistsException ex) {
        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(Map.of("error", ex.getMessage()));
    }

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<Map<String, String>> handleInvalidCredentials(InvalidCredentialsException ex) {
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", ex.getMessage()));
    }

    // ✅ Token de vérification d'email / réinitialisation invalide, expiré ou déjà utilisé.
    @ExceptionHandler(InvalidTokenException.class)
    public ResponseEntity<Map<String, String>> handleInvalidToken(InvalidTokenException ex) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", ex.getMessage()));
    }

    // ✅ Capture les erreurs de validation (@Valid).
    // Forme de réponse cohérente avec les autres handlers : { "error": ..., "fields": {...} }.
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, String> fields = new LinkedHashMap<>();
        ex.getBindingResult().getFieldErrors()
          .forEach(err -> fields.putIfAbsent(err.getField(), err.getDefaultMessage()));
        String message = fields.values().stream().collect(Collectors.joining(" "));
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("error", message);
        body.put("fields", fields);
        return ResponseEntity.badRequest().body(body);
    }

    // ✅ Validations métier manuelles (ex : champs étudiant manquants)
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleIllegalArgument(IllegalArgumentException ex) {
        return ResponseEntity
                .badRequest()
                .body(Map.of("error", ex.getMessage()));
    }

    // ✅ Query param d'un type incompatible (ex : ?role=PATATE alors qu'on attend Role)
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<Map<String, String>> handleTypeMismatch(MethodArgumentTypeMismatchException ex) {
        Class<?> requiredType = ex.getRequiredType();
        String accepted = requiredType != null && requiredType.isEnum()
                ? " (valeurs acceptées : " + String.join(", ",
                        java.util.Arrays.stream(requiredType.getEnumConstants())
                                .map(Object::toString)
                                .toList())
                + ")"
                : "";
        String message = "Valeur invalide pour le paramètre « " + ex.getName() + " » : " + ex.getValue() + accepted;
        return ResponseEntity
                .badRequest()
                .body(Map.of("error", message));
    }

    // ✅ Accès refusé (autorisation par classe, droits insuffisants) → 403 JSON cohérent.
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Map<String, String>> handleAccessDenied(AccessDeniedException ex) {
        String message = ex.getMessage() != null ? ex.getMessage() : "Accès refusé";
        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(Map.of("error", message));
    }

    // ✅ Violation d'intégrité (clé étrangère, contrainte d'unicité) → 409 Conflict.
    // Ex : suppression d'une classe encore référencée par des étudiants/cours.
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, String>> handleDataIntegrity(DataIntegrityViolationException ex) {
        log.warn("Violation d'intégrité des données", ex);
        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(Map.of("error", "Opération impossible : cet élément est encore utilisé par d'autres données."));
    }

    // ✅ Filet de sécurité : toute erreur non gérée renvoie un 500 JSON cohérent,
    // sans divulguer la stacktrace au client (elle est journalisée côté serveur).
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleUnexpected(Exception ex) {
        log.error("Erreur inattendue", ex);
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Une erreur interne est survenue"));
    }
}