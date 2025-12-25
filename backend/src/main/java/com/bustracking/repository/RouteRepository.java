package com.bustracking.repository;

import com.bustracking.entity.Route;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository pour l'entité Route
 */
@Repository
public interface RouteRepository extends JpaRepository<Route, Long> {
        List<Route> findByStartLocationIgnoreCaseAndEndLocationIgnoreCase(String startLocation, String endLocation);
    
    Optional<Route> findByRouteNumber(String routeNumber);
    
    List<Route> findByStatus(Route.Status status);
    
    @Query("SELECT r FROM Route r WHERE r.status = 'active' ORDER BY r.name")
    List<Route> findActiveRoutes();
    
    @Query("SELECT r FROM Route r LEFT JOIN FETCH r.stops WHERE r.id = :id")
    Optional<Route> findByIdWithStops(Long id);
    
    List<Route> findAllByOrderByNameAsc();
}
