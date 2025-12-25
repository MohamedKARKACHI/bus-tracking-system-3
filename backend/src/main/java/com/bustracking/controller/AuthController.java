package com.bustracking.controller;

import com.bustracking.dto.request.LoginRequest;
import com.bustracking.dto.request.RegisterRequest;
import com.bustracking.dto.response.ApiResponse;
import com.bustracking.dto.response.AuthResponse;
import com.bustracking.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Contrôleur REST pour l'authentification
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthService authService;

    /**
     * Inscription d'un nouvel utilisateur
     * POST /api/auth/register
     */
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        try {
            AuthResponse response = authService.register(request);
            return ResponseEntity.ok(ApiResponse.success("Inscription réussie", response));
        } catch (RuntimeException e) {
            log.error("Erreur d'inscription: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * Connexion d'un utilisateur
     * POST /api/auth/login
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        try {
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(ApiResponse.success("Connexion réussie", response));
        } catch (Exception e) {
            log.error("Erreur de connexion pour {}: {}", request.getEmail(), e.getMessage(), e);
            return ResponseEntity.status(401).body(ApiResponse.error("Identifiants invalides"));
        }
    }
}
