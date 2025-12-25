package com.bustracking.repository;

import com.bustracking.entity.GpsTracking;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repository pour l'entité GpsTracking
 */
@Repository
public interface GpsTrackingRepository extends JpaRepository<GpsTracking, Long> {
    
    List<GpsTracking> findByBusIdOrderByTimestampDesc(Long busId, Pageable pageable);
    
    @Query("SELECT g FROM GpsTracking g WHERE g.bus.id = :busId ORDER BY g.timestamp DESC LIMIT 1")
    Optional<GpsTracking> findLatestByBusId(Long busId);
    
    @Query(value = """
        SELECT g.* FROM gps_tracking g 
        INNER JOIN (
            SELECT bus_id, MAX(timestamp) as max_timestamp 
            FROM gps_tracking 
            GROUP BY bus_id
        ) latest ON g.bus_id = latest.bus_id AND g.timestamp = latest.max_timestamp
        """, nativeQuery = true)
    List<GpsTracking> findLatestForAllBuses();
    
    @Query("SELECT g FROM GpsTracking g WHERE g.bus.id = :busId AND g.timestamp BETWEEN :start AND :end ORDER BY g.timestamp")
    List<GpsTracking> findByBusIdAndTimestampBetween(Long busId, LocalDateTime start, LocalDateTime end);
    
    List<GpsTracking> findByBusId(Long busId);
}
