package com.bustracking.controller;

import com.bustracking.dto.request.BusRequest;
import com.bustracking.dto.response.ApiResponse;
import com.bustracking.dto.response.BusResponse;
import com.bustracking.service.BusService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Contrôleur REST pour la gestion des bus
 */
@RestController
@RequestMapping("/api/buses")
@RequiredArgsConstructor
public class BusController {

    private final BusService busService;

    /**
     * Récupérer tous les bus
     * GET /api/buses
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<BusResponse>>> getAllBuses() {
        List<BusResponse> buses = busService.getAllBuses();
        return ResponseEntity.ok(ApiResponse.success(buses));
    }

    /**
     * Récupérer les bus actifs
     * GET /api/buses/active
     */
    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<BusResponse>>> getActiveBuses() {
        List<BusResponse> buses = busService.getActiveBuses();
        return ResponseEntity.ok(ApiResponse.success(buses));
    }

    /**
     * Récupérer un bus par ID
     * GET /api/buses/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BusResponse>> getBusById(@PathVariable Long id) {
        try {
            BusResponse bus = busService.getBusById(id);
            return ResponseEntity.ok(ApiResponse.success(bus));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Créer un bus
     * POST /api/buses
     */
    @PostMapping
    public ResponseEntity<ApiResponse<BusResponse>> createBus(@Valid @RequestBody BusRequest request) {
        try {
            BusResponse bus = busService.createBus(request);
            return ResponseEntity.ok(ApiResponse.success("Bus créé", bus));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * Mettre à jour un bus
     * PUT /api/buses/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<BusResponse>> updateBus(
            @PathVariable Long id,
            @Valid @RequestBody BusRequest request) {
        try {
            BusResponse bus = busService.updateBus(id, request);
            return ResponseEntity.ok(ApiResponse.success("Bus mis à jour", bus));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * Supprimer un bus
     * DELETE /api/buses/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteBus(@PathVariable Long id) {
        try {
            busService.deleteBus(id);
            return ResponseEntity.ok(ApiResponse.success("Bus supprimé", null));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
