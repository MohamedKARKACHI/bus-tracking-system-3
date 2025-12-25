package com.bustracking.controller;

import com.bustracking.dto.request.RouteRequest;
import com.bustracking.dto.response.ApiResponse;
import com.bustracking.entity.Route;
import com.bustracking.service.RouteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Contrôleur REST pour la gestion des routes
 */
@RestController
@RequestMapping("/api/routes")
@RequiredArgsConstructor
public class RouteController {

    private final RouteService routeService;

    /**
     * Récupérer toutes les routes
     * GET /api/routes
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<Route>>> getAllRoutes(
            @RequestParam(value = "from", required = false) String from,
            @RequestParam(value = "to", required = false) String to) {
        List<Route> routes;
        if (from != null && to != null) {
            routes = routeService.getRoutesByStartAndEndLocation(from, to);
        } else {
            routes = routeService.getAllRoutes();
        }
        return ResponseEntity.ok(ApiResponse.success(routes));
    }

    /**
     * Récupérer les routes actives
     * GET /api/routes/active
     */
    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<Route>>> getActiveRoutes() {
        List<Route> routes = routeService.getActiveRoutes();
        return ResponseEntity.ok(ApiResponse.success(routes));
    }

    /**
     * Récupérer une route par ID
     * GET /api/routes/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Route>> getRouteById(@PathVariable Long id) {
        try {
            Route route = routeService.getRouteById(id);
            return ResponseEntity.ok(ApiResponse.success(route));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Récupérer une route avec ses arrêts
     * GET /api/routes/{id}/stops
     */
    @GetMapping("/{id}/stops")
    public ResponseEntity<ApiResponse<Route>> getRouteWithStops(@PathVariable Long id) {
        try {
            Route route = routeService.getRouteWithStops(id);
            return ResponseEntity.ok(ApiResponse.success(route));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Créer une route
     * POST /api/routes
     */
    @PostMapping
    public ResponseEntity<ApiResponse<Route>> createRoute(@Valid @RequestBody RouteRequest request) {
        try {
            Route route = routeService.createRoute(request);
            return ResponseEntity.ok(ApiResponse.success("Route créée", route));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * Mettre à jour une route
     * PUT /api/routes/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Route>> updateRoute(
            @PathVariable Long id,
            @Valid @RequestBody RouteRequest request) {
        try {
            Route route = routeService.updateRoute(id, request);
            return ResponseEntity.ok(ApiResponse.success("Route mise à jour", route));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * Supprimer une route
     * DELETE /api/routes/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteRoute(@PathVariable Long id) {
        try {
            routeService.deleteRoute(id);
            return ResponseEntity.ok(ApiResponse.success("Route supprimée", null));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
