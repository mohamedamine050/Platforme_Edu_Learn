package com.e_learning.project.controller;

import com.e_learning.project.dto.ClassRequest;
import com.e_learning.project.dto.ClassResponse;
import com.e_learning.project.service.ClassService;
import jakarta.validation.Valid;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/classes")
@Tag(name = "Classes", description = "Gestion des classes")
public class ClassController {

    private final ClassService classService;

    public ClassController(ClassService classService) {
        this.classService = classService;
    }

    @PostMapping
    @Operation(summary = "Créer une classe", description = "Crée une nouvelle classe à partir des données envoyées")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Classe créée avec succès"),
            @ApiResponse(responseCode = "400", description = "Données invalides")
    })
    public ResponseEntity<ClassResponse> create(
            @Valid @RequestBody ClassRequest request) {

        ClassResponse response = classService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    @Operation(summary = "Lister toutes les classes", description = "Retourne la liste de toutes les classes")
    public ResponseEntity<List<ClassResponse>> getAll() {
        return ResponseEntity.ok(classService.getAll());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtenir une classe par id", description = "Retourne une classe spécifique à partir de son identifiant")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Classe trouvée"),
            @ApiResponse(responseCode = "404", description = "Classe introuvable")
    })
    public ResponseEntity<ClassResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(classService.getById(id));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Mettre à jour une classe", description = "Met à jour une classe existante")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Classe mise à jour"),
            @ApiResponse(responseCode = "400", description = "Données invalides"),
            @ApiResponse(responseCode = "404", description = "Classe introuvable")
    })
    public ResponseEntity<ClassResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody ClassRequest request) {

        return ResponseEntity.ok(classService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Supprimer une classe", description = "Supprime une classe existante à partir de son identifiant")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Classe supprimée"),
            @ApiResponse(responseCode = "404", description = "Classe introuvable")
    })
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        classService.delete(id);
        return ResponseEntity.noContent().build();
    }
}