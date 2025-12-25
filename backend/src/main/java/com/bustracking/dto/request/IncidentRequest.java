package com.bustracking.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

/**
 * DTO pour la création d'un incident
 */
@Data
public class IncidentRequest {
    
    @NotNull(message = "L'ID du bus est obligatoire")
    private Long busId;
    
    @NotNull(message = "L'ID du conducteur est obligatoire")
    private Long driverId;
    
    private Long scheduleId;
    
    @NotBlank(message = "Le type d'incident est obligatoire")
    private String incidentType;
    
    @NotBlank(message = "La description est obligatoire")
    private String description;
    
    private String severity;
    
    private BigDecimal latitude;
    
    private BigDecimal longitude;
}
