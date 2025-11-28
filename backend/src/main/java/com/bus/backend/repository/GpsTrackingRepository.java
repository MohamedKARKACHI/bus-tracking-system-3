package com.bus.backend.repository;

import com.bus.backend.model.Bus;
import com.bus.backend.model.GpsTracking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GpsTrackingRepository extends JpaRepository<GpsTracking, Long> {
    
    @Query("SELECT g FROM GpsTracking g WHERE g.bus.id = :busId ORDER BY g.timestamp DESC")
    List<GpsTracking> findByBusIdOrderByTimestampDesc(Long busId);
    
    @Query("SELECT g FROM GpsTracking g WHERE g.id IN " +
           "(SELECT MAX(g2.id) FROM GpsTracking g2 GROUP BY g2.bus.id)")
    List<GpsTracking> findLatestPositions();
    
    Optional<GpsTracking> findFirstByBusOrderByTimestampDesc(Bus bus);
}
