package com.bustracking.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * DTO pour la réponse Bus
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BusResponse {
    
    private Long id;
    private String busNumber;
    private String plateNumber;
    private String model;
    private Integer capacity;
    private Integer year;
    private String status;
    private String fuelType;
    private LocalDate lastMaintenance;
    private LocalDate nextMaintenance;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Relations
    private String driverName;
    private Long driverId;
    private String routeName;
    private Long routeId;
}
