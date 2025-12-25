package com.bustracking.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

/**
 * DTO pour la création/modification d'un bus
 */
@Data
public class BusRequest {
    
    @NotBlank(message = "Le numéro de bus est obligatoire")
    private String busNumber;
    
    @NotBlank(message = "Le numéro de plaque est obligatoire")
    private String plateNumber;
    
    @NotBlank(message = "Le modèle est obligatoire")
    private String model;
    
    @NotNull(message = "La capacité est obligatoire")
    @Positive(message = "La capacité doit être positive")
    private Integer capacity;
    
    private Integer year;
    
    private String status;
    
    private String fuelType;
    
    private Long driverId;
    
    private Long routeId;
}
