package com.bustracking.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Entité Bus - Représente les véhicules de la flotte
 */
@Entity
@Table(name = "buses")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Bus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "bus_number", nullable = false, unique = true)
    private String busNumber;

    @Column(name = "plate_number", nullable = false, unique = true)
    private String plateNumber;

    @Column(nullable = false)
    private String model;

    @Column(nullable = false)
    private Integer capacity;

    private Integer year;

    // Stocké en tant que String pour supporter les valeurs mixtes (active/ACTIVE)
    @Builder.Default
    @Column(name = "status")
    private String status = "active";

    @Column(name = "last_maintenance")
    private LocalDate lastMaintenance;

    @Column(name = "next_maintenance")
    private LocalDate nextMaintenance;

    // Stocké en tant que String pour supporter les valeurs mixtes (diesel/DIESEL)
    @Builder.Default
    @Column(name = "fuel_type")
    private String fuelType = "diesel";

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "current_driver_id")
    private Driver currentDriver;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "route_id")
    private Route route;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Méthodes utilitaires pour vérifier le status
    public boolean isActive() {
        return status != null && status.equalsIgnoreCase("active");
    }

    public boolean isInMaintenance() {
        return status != null && status.equalsIgnoreCase("maintenance");
    }

    public boolean isOutOfService() {
        return status != null && status.equalsIgnoreCase("out_of_service");
    }
}
