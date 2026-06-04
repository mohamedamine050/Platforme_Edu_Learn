package com.e_learning.project.controller;

import com.e_learning.project.dto.PageResponse;
import com.e_learning.project.dto.UserAccessRequest;
import com.e_learning.project.dto.UserRequest;
import com.e_learning.project.dto.UserResponse;
import com.e_learning.project.enums.Role;
import com.e_learning.project.service.UserService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // CREATE
    @PostMapping("/users")
    public ResponseEntity<UserResponse> create(@Valid @RequestBody UserRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.create(request));
    }

    // LIST paginée (query params : ?role=&search=&page=&size=&sort=createdAt,desc)
    @GetMapping("/users")
    public PageResponse<UserResponse> getAll(
            @RequestParam(required = false) Role role,
            @RequestParam(required = false) String search,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return userService.getAll(role, search, pageable);
    }

    // GET
    @GetMapping("/users/{id}")
    public UserResponse getById(@PathVariable UUID id) {
        return userService.getById(id);
    }

    // UPDATE
    @PutMapping("/users/{id}")
    public UserResponse update(@PathVariable UUID id,
                               @Valid @RequestBody UserRequest request) {
        return userService.update(id, request);
    }

    // Accorde / révoque l'accès au contenu (vidéos, documents).
    @PutMapping("/users/{id}/access")
    public UserResponse setAccess(@PathVariable UUID id,
                                  @Valid @RequestBody UserAccessRequest request) {
        return userService.setAccess(id, request.getGranted());
    }

    // DELETE
    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
