package com.bustracking.controller;

import com.bustracking.dto.request.GpsUpdateRequest;
import com.bustracking.dto.response.ApiResponse;
import com.bustracking.dto.response.GpsResponse;
import com.bustracking.service.GpsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Contrôleur REST pour le suivi GPS
 */
@RestController
@RequestMapping("/api/gps")
@RequiredArgsConstructor
public class GpsController {

    private final GpsService gpsService;

    /**
     * Récupérer les dernières positions de tous les bus
     * GET /api/gps/latest
     */
    @GetMapping("/latest")
    public ResponseEntity<ApiResponse<List<GpsResponse>>> getLatestPositions() {
        List<GpsResponse> positions = gpsService.getLatestPositions();
        return ResponseEntity.ok(ApiResponse.success(positions));
    }

    /**
     * Récupérer l'historique GPS d'un bus
     * GET /api/gps/bus/{busId}/history
     */
    @GetMapping("/bus/{busId}/history")
    public ResponseEntity<ApiResponse<List<GpsResponse>>> getBusHistory(
            @PathVariable Long busId,
            @RequestParam(defaultValue = "100") int limit) {
        List<GpsResponse> history = gpsService.getBusHistory(busId, limit);
        return ResponseEntity.ok(ApiResponse.success(history));
    }

    /**
     * Récupérer la dernière position d'un bus
     * GET /api/gps/bus/{busId}/latest
     */
    @GetMapping("/bus/{busId}/latest")
    public ResponseEntity<ApiResponse<GpsResponse>> getLatestPosition(@PathVariable Long busId) {
        try {
            GpsResponse position = gpsService.getLatestPosition(busId);
            return ResponseEntity.ok(ApiResponse.success(position));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Mettre à jour la position GPS d'un bus
     * POST /api/gps/update
     */
    @PostMapping("/update")
    public ResponseEntity<ApiResponse<GpsResponse>> updatePosition(@Valid @RequestBody GpsUpdateRequest request) {
        try {
            GpsResponse response = gpsService.updatePosition(request);
            return ResponseEntity.ok(ApiResponse.success("Position mise à jour", response));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
