package com.bustracking.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;

/**
 * DTO pour la création d'un ticket
 */
@Data
public class TicketRequest {
    
    @NotNull(message = "L'ID de l'utilisateur est obligatoire")
    private Long userId;
    
    @NotNull(message = "L'ID du planning est obligatoire")
    private Long scheduleId;
    
    private String seatNumber;
    
    @NotNull(message = "L'ID de l'arrêt de départ est obligatoire")
    private Long boardingStopId;
    
    @NotNull(message = "L'ID de l'arrêt d'arrivée est obligatoire")
    private Long destinationStopId;
    
    @NotNull(message = "Le tarif est obligatoire")
    @Positive(message = "Le tarif doit être positif")
    private BigDecimal fare;
    
    private String paymentMethod;
}
