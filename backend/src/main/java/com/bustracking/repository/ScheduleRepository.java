package com.bustracking.repository;

import com.bustracking.entity.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repository pour l'entité Schedule
 */
@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
    
    List<Schedule> findByStatus(Schedule.Status status);
    
    List<Schedule> findByBusId(Long busId);
    
    List<Schedule> findByDriverId(Long driverId);
    
    List<Schedule> findByRouteId(Long routeId);
    
    @Query("SELECT s FROM Schedule s WHERE s.departureTime BETWEEN :start AND :end ORDER BY s.departureTime")
    List<Schedule> findByDepartureTimeBetween(LocalDateTime start, LocalDateTime end);
    
    @Query("SELECT s FROM Schedule s LEFT JOIN FETCH s.bus LEFT JOIN FETCH s.route ORDER BY s.departureTime")
    List<Schedule> findAllWithDetails();
    
    @Query("SELECT s FROM Schedule s WHERE s.status = 'in_progress'")
    List<Schedule> findActiveSchedules();
}
