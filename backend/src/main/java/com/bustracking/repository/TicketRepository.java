package com.bustracking.repository;

import com.bustracking.entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository pour l'entité Ticket
 */
@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {
    
    Optional<Ticket> findByTicketNumber(String ticketNumber);
    
    List<Ticket> findByUserId(Long userId);
    
    List<Ticket> findByUserIdOrderByBookingDateDesc(Long userId);
    
    List<Ticket> findByScheduleId(Long scheduleId);
    
    List<Ticket> findByStatus(Ticket.Status status);
    
    @Query("SELECT t FROM Ticket t LEFT JOIN FETCH t.schedule s LEFT JOIN FETCH s.route LEFT JOIN FETCH s.bus WHERE t.user.id = :userId ORDER BY t.bookingDate DESC")
    List<Ticket> findByUserIdWithDetails(Long userId);
    
    @Query("SELECT COUNT(t) FROM Ticket t WHERE t.schedule.id = :scheduleId AND t.status != 'cancelled'")
    long countActiveTicketsBySchedule(Long scheduleId);
}
