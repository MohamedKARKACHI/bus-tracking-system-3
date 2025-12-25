package com.bustracking.repository;

import com.bustracking.entity.RouteStop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository pour l'entité RouteStop
 */
@Repository
public interface RouteStopRepository extends JpaRepository<RouteStop, Long> {
    
    List<RouteStop> findByRouteIdOrderByStopOrderAsc(Long routeId);
}
