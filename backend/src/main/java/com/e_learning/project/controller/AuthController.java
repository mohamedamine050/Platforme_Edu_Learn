package com.e_learning.project.controller;

import com.e_learning.project.dto.AuthRequest;
import com.e_learning.project.dto.ForgotPasswordRequest;
import com.e_learning.project.dto.RegisterRequest;
import com.e_learning.project.dto.RegistrationOptionsResponse;
import com.e_learning.project.dto.ResendVerificationRequest;
import com.e_learning.project.dto.ResetPasswordRequest;
import com.e_learning.project.dto.UserResponse;
import com.e_learning.project.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@Valid @RequestBody RegisterRequest request) {
        // Pas de cookie d'auth ici : l'utilisateur doit d'abord vérifier son email
        // (un lien lui est envoyé) avant de pouvoir se connecter.
        UserResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/verify-email")
    public ResponseEntity<Void> verifyEmail(@RequestParam String token) {
        authService.verifyEmail(token);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/resend-verification")
    public ResponseEntity<Void> resendVerification(@Valid @RequestBody ResendVerificationRequest request) {
        // 200 systématique (anti-énumération) : ne révèle pas si l'email existe / est vérifié.
        authService.resendVerification(request.getEmail());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Void> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        // 200 systématique (anti-énumération) : ne révèle pas si l'email existe.
        authService.requestPasswordReset(request.getEmail());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Void> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request.getToken(), request.getPassword());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/login")
    public ResponseEntity<UserResponse> login(@Valid @RequestBody AuthRequest request) {
        UserResponse response = authService.login(request);
        ResponseCookie cookie = authService.buildAuthCookie(response.getEmail());
        return ResponseEntity.ok()
                .header("Set-Cookie", cookie.toString())
                .body(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        authService.clearCurrentSession();
        ResponseCookie cookie = authService.buildLogoutCookie();
        return ResponseEntity.ok().header("Set-Cookie", cookie.toString()).build();
    }

    @GetMapping("/registration-options")
    public ResponseEntity<RegistrationOptionsResponse> registrationOptions() {
        return ResponseEntity.ok(authService.getRegistrationOptions());
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> me() {
        return ResponseEntity.ok(authService.getCurrentUser());
    }
}
