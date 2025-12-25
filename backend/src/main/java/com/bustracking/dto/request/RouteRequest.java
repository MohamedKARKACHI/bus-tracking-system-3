package com.bustracking.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

/**
 * DTO pour la création/modification d'une route
 */
@Data
public class RouteRequest {
    
    @NotBlank(message = "Le numéro de route est obligatoire")
    private String routeNumber;
    
    @NotBlank(message = "Le nom est obligatoire")
    private String name;
    
    @NotBlank(message = "Le point de départ est obligatoire")
    private String startLocation;
    
    @NotBlank(message = "Le point d'arrivée est obligatoire")
    private String endLocation;
    
    private BigDecimal distanceKm;
    
    private Integer estimatedDurationMinutes;
    
    private String status;
    
    @NotNull(message = "Le tarif est obligatoire")
    private BigDecimal fare;
}
