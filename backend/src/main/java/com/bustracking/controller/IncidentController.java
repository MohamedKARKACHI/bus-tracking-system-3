package com.bustracking.controller;

import com.bustracking.dto.request.IncidentRequest;
import com.bustracking.dto.response.ApiResponse;
import com.bustracking.entity.Incident;
import com.bustracking.service.IncidentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Contrôleur REST pour la gestion des incidents
 */
@RestController
@RequestMapping("/api/incidents")
@RequiredArgsConstructor
public class IncidentController {

    private final IncidentService incidentService;

    /**
     * Récupérer tous les incidents
     * GET /api/incidents
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<Incident>>> getAllIncidents() {
        List<Incident> incidents = incidentService.getAllIncidents();
        return ResponseEntity.ok(ApiResponse.success(incidents));
    }

    /**
     * Récupérer les incidents actifs
     * GET /api/incidents/active
     */
    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<Incident>>> getActiveIncidents() {
        List<Incident> incidents = incidentService.getActiveIncidents();
        return ResponseEntity.ok(ApiResponse.success(incidents));
    }

    /**
     * Récupérer un incident par ID
     * GET /api/incidents/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Incident>> getIncidentById(@PathVariable Long id) {
        try {
            Incident incident = incidentService.getIncidentById(id);
            return ResponseEntity.ok(ApiResponse.success(incident));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Créer un incident
     * POST /api/incidents
     */
    @PostMapping
    public ResponseEntity<ApiResponse<Incident>> createIncident(@Valid @RequestBody IncidentRequest request) {
        try {
            Incident incident = incidentService.createIncident(request);
            return ResponseEntity.ok(ApiResponse.success("Incident signalé", incident));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * Mettre à jour le statut d'un incident
     * PATCH /api/incidents/{id}/status
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<Incident>> updateIncidentStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        try {
            Incident incident = incidentService.updateIncidentStatus(id, status);
            return ResponseEntity.ok(ApiResponse.success("Statut mis à jour", incident));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
