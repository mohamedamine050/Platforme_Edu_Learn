package com.e_learning.project.controller;

import com.e_learning.project.dto.UserRequest;
import com.e_learning.project.dto.UserResponse;
import com.e_learning.project.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
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

    // LIST
    @GetMapping("/users")
    public List<UserResponse> getAll() {
        return userService.getAll();
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

    // DELETE
    @DeleteMapping("/users/{id}")
    public void delete(@PathVariable UUID id) {
        userService.delete(id);
    }
}
