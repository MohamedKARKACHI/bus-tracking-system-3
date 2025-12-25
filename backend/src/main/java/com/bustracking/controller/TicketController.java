package com.bustracking.controller;

import com.bustracking.dto.request.TicketRequest;
import com.bustracking.dto.response.ApiResponse;
import com.bustracking.entity.Ticket;
import com.bustracking.service.TicketService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Contrôleur REST pour la gestion des tickets
 */
@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;

    /**
     * Récupérer tous les tickets
     * GET /api/tickets
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<Ticket>>> getAllTickets() {
        List<Ticket> tickets = ticketService.getAllTickets();
        return ResponseEntity.ok(ApiResponse.success(tickets));
    }

    /**
     * Récupérer les tickets d'un utilisateur
     * GET /api/tickets/user/{userId}
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<Ticket>>> getUserTickets(@PathVariable Long userId) {
        List<Ticket> tickets = ticketService.getUserTickets(userId);
        return ResponseEntity.ok(ApiResponse.success(tickets));
    }

    /**
     * Récupérer un ticket par numéro
     * GET /api/tickets/{ticketNumber}
     */
    @GetMapping("/{ticketNumber}")
    public ResponseEntity<ApiResponse<Ticket>> getTicketByNumber(@PathVariable String ticketNumber) {
        try {
            Ticket ticket = ticketService.getTicketByNumber(ticketNumber);
            return ResponseEntity.ok(ApiResponse.success(ticket));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Créer un ticket
     * POST /api/tickets
     */
    @PostMapping
    public ResponseEntity<ApiResponse<Ticket>> createTicket(@Valid @RequestBody TicketRequest request) {
        try {
            Ticket ticket = ticketService.createTicket(request);
            return ResponseEntity.ok(ApiResponse.success("Ticket créé", ticket));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * Mettre à jour le statut d'un ticket
     * PATCH /api/tickets/{ticketNumber}/status
     */
    @PatchMapping("/{ticketNumber}/status")
    public ResponseEntity<ApiResponse<Ticket>> updateTicketStatus(
            @PathVariable String ticketNumber,
            @RequestParam String status) {
        try {
            Ticket ticket = ticketService.updateTicketStatus(ticketNumber, status);
            return ResponseEntity.ok(ApiResponse.success("Statut mis à jour", ticket));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * Annuler un ticket
     * DELETE /api/tickets/{ticketNumber}
     */
    @DeleteMapping("/{ticketNumber}")
    public ResponseEntity<ApiResponse<Ticket>> cancelTicket(@PathVariable String ticketNumber) {
        try {
            Ticket ticket = ticketService.cancelTicket(ticketNumber);
            return ResponseEntity.ok(ApiResponse.success("Ticket annulé", ticket));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
