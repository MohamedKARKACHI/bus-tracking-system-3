package com.bustracking.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Contrôleur pour le health check
 */
@RestController
public class HealthController {

    /**
     * Vérifier l'état de santé de l'application
     * GET /health
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "ok");
        response.put("timestamp", LocalDateTime.now().toString());
        response.put("service", "Bus Tracking System API");
        response.put("version", "1.0.0");
        return ResponseEntity.ok(response);
    }
}
