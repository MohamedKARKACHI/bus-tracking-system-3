package com.bustracking.repository;

import com.bustracking.entity.Bus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository pour l'entité Bus
 */
@Repository
public interface BusRepository extends JpaRepository<Bus, Long> {
    
    Optional<Bus> findByBusNumber(String busNumber);
    
    Optional<Bus> findByPlateNumber(String plateNumber);
    
    List<Bus> findByStatus(String status);
    
    @Query("SELECT b FROM Bus b WHERE LOWER(b.status) = 'active'")
    List<Bus> findActiveBuses();
    
    @Query("SELECT b FROM Bus b LEFT JOIN FETCH b.currentDriver LEFT JOIN FETCH b.route ORDER BY b.busNumber")
    List<Bus> findAllWithDetails();
    
    @Query("SELECT COUNT(b) FROM Bus b WHERE LOWER(b.status) = LOWER(:status)")
    long countByStatus(@Param("status") String status);
}
