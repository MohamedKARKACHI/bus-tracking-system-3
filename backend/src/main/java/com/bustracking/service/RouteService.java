package com.bustracking.service;

import com.bustracking.dto.request.RouteRequest;
import com.bustracking.entity.Route;
import com.bustracking.repository.RouteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service de gestion des routes
 */
@Service
@RequiredArgsConstructor
public class RouteService {
    public List<Route> getRoutesByStartAndEndLocation(String from, String to) {
        return routeRepository.findByStartLocationIgnoreCaseAndEndLocationIgnoreCase(from, to);
    }

    private final RouteRepository routeRepository;

    /**
     * Récupérer toutes les routes
     */
    public List<Route> getAllRoutes() {
        return routeRepository.findAllByOrderByNameAsc();
    }

    /**
     * Récupérer les routes actives
     */
    public List<Route> getActiveRoutes() {
        return routeRepository.findActiveRoutes();
    }

    /**
     * Récupérer une route par ID
     */
    public Route getRouteById(Long id) {
        return routeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Route non trouvée"));
    }

    /**
     * Récupérer une route avec ses arrêts
     */
    public Route getRouteWithStops(Long id) {
        return routeRepository.findByIdWithStops(id)
                .orElseThrow(() -> new RuntimeException("Route non trouvée"));
    }

    /**
     * Créer une route
     */
    @Transactional
    public Route createRoute(RouteRequest request) {
        Route route = Route.builder()
                .routeNumber(request.getRouteNumber())
                .name(request.getName())
                .startLocation(request.getStartLocation())
                .endLocation(request.getEndLocation())
                .distanceKm(request.getDistanceKm())
                .estimatedDurationMinutes(request.getEstimatedDurationMinutes())
                .status(request.getStatus() != null ? 
                        Route.Status.valueOf(request.getStatus()) : Route.Status.active)
                .fare(request.getFare())
                .build();

        return routeRepository.save(route);
    }

    /**
     * Mettre à jour une route
     */
    @Transactional
    public Route updateRoute(Long id, RouteRequest request) {
        Route route = getRouteById(id);

        route.setRouteNumber(request.getRouteNumber());
        route.setName(request.getName());
        route.setStartLocation(request.getStartLocation());
        route.setEndLocation(request.getEndLocation());
        route.setDistanceKm(request.getDistanceKm());
        route.setEstimatedDurationMinutes(request.getEstimatedDurationMinutes());
        route.setFare(request.getFare());
        
        if (request.getStatus() != null) {
            route.setStatus(Route.Status.valueOf(request.getStatus()));
        }

        return routeRepository.save(route);
    }

    /**
     * Supprimer une route
     */
    @Transactional
    public void deleteRoute(Long id) {
        if (!routeRepository.existsById(id)) {
            throw new RuntimeException("Route non trouvée");
        }
        routeRepository.deleteById(id);
    }
}
