package com.bustracking.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "plate_detections")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlateDetection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "plate_number", nullable = false)
    private String plateNumber;

    @Column(name = "serial_number")
    private String serialNumber;

    @Column(name = "arabic_letter")
    private String arabicLetter;

    @Column(name = "region_code")
    private String regionCode;

    @Enumerated(EnumType.STRING)
    @Column(name = "event_type", nullable = false)
    private EventType eventType;

    @Column(name = "confidence")
    private Float confidence;

    @CreationTimestamp
    @Column(name = "timestamp", updatable = false)
    private LocalDateTime timestamp;

    public enum EventType {
        CHECK_IN, CHECK_OUT
    }
}
