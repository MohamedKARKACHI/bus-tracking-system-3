package com.bustracking.service;

import com.bustracking.dto.request.TicketRequest;
import com.bustracking.entity.*;
import com.bustracking.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

/**
 * Service de gestion des tickets
 */
@Service
@RequiredArgsConstructor
public class TicketService {

    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final ScheduleRepository scheduleRepository;
    private final RouteStopRepository routeStopRepository;

    /**
     * Récupérer tous les tickets
     */
    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    /**
     * Récupérer les tickets d'un utilisateur
     */
    public List<Ticket> getUserTickets(Long userId) {
        return ticketRepository.findByUserIdOrderByBookingDateDesc(userId);
    }

    /**
     * Récupérer un ticket par numéro
     */
    public Ticket getTicketByNumber(String ticketNumber) {
        return ticketRepository.findByTicketNumber(ticketNumber)
                .orElseThrow(() -> new RuntimeException("Ticket non trouvé"));
    }

    /**
     * Créer un ticket
     */
    @Transactional
    public Ticket createTicket(TicketRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        Schedule schedule = scheduleRepository.findById(request.getScheduleId())
                .orElseThrow(() -> new RuntimeException("Planning non trouvé"));

        RouteStop boardingStop = routeStopRepository.findById(request.getBoardingStopId())
                .orElseThrow(() -> new RuntimeException("Arrêt de départ non trouvé"));

        RouteStop destinationStop = routeStopRepository.findById(request.getDestinationStopId())
                .orElseThrow(() -> new RuntimeException("Arrêt d'arrivée non trouvé"));

        // Générer un numéro de ticket unique
        String ticketNumber = "TCK-" + System.currentTimeMillis() + "-" + 
                UUID.randomUUID().toString().substring(0, 4).toUpperCase();

        Ticket ticket = Ticket.builder()
                .ticketNumber(ticketNumber)
                .user(user)
                .schedule(schedule)
                .seatNumber(request.getSeatNumber())
                .boardingStop(boardingStop)
                .destinationStop(destinationStop)
                .fare(request.getFare())
                .status(Ticket.Status.confirmed)
                .paymentStatus(Ticket.PaymentStatus.paid)
                .paymentMethod(request.getPaymentMethod() != null ? 
                        Ticket.PaymentMethod.valueOf(request.getPaymentMethod()) : Ticket.PaymentMethod.card)
                .build();

        return ticketRepository.save(ticket);
    }

    /**
     * Mettre à jour le statut d'un ticket
     */
    @Transactional
    public Ticket updateTicketStatus(String ticketNumber, String status) {
        Ticket ticket = getTicketByNumber(ticketNumber);
        ticket.setStatus(Ticket.Status.valueOf(status));
        return ticketRepository.save(ticket);
    }

    /**
     * Annuler un ticket
     */
    @Transactional
    public Ticket cancelTicket(String ticketNumber) {
        Ticket ticket = getTicketByNumber(ticketNumber);
        ticket.setStatus(Ticket.Status.cancelled);
        ticket.setPaymentStatus(Ticket.PaymentStatus.refunded);
        return ticketRepository.save(ticket);
    }
}
