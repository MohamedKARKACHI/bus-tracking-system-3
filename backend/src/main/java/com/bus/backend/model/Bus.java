package com.bus.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "buses")
public class Bus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "registration_number", nullable = false, unique = true, length = 20)
    private String registrationNumber;

    @Column(nullable = false, length = 100)
    private String model;

    @Column(nullable = false)
    private Integer capacity;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private BusStatus status = BusStatus.ACTIVE;

    @Column(length = 4)
    private String year;

    public enum BusStatus {
        ACTIVE, MAINTENANCE, INACTIVE
    }
}
