package com.bustracking.repository;

import com.bustracking.entity.Incident;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository pour l'entité Incident
 */
@Repository
public interface IncidentRepository extends JpaRepository<Incident, Long> {
    
    List<Incident> findByBusId(Long busId);
    
    List<Incident> findByDriverId(Long driverId);
    
    List<Incident> findByStatus(Incident.Status status);
    
    List<Incident> findBySeverity(Incident.Severity severity);
    
    @Query("SELECT i FROM Incident i LEFT JOIN FETCH i.bus LEFT JOIN FETCH i.driver ORDER BY i.reportedAt DESC")
    List<Incident> findAllWithDetails();
    
    @Query("SELECT i FROM Incident i WHERE i.status IN ('reported', 'investigating') ORDER BY i.severity DESC, i.reportedAt DESC")
    List<Incident> findActiveIncidents();
    
    @Query("SELECT COUNT(i) FROM Incident i WHERE i.status = :status")
    long countByStatus(Incident.Status status);
}
