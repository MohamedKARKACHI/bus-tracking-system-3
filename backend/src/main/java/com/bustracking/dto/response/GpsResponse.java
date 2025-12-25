package com.bustracking.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * DTO pour la réponse GPS
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GpsResponse {
    
    private Long id;
    private Long busId;
    private String busNumber;
    private String plateNumber;
    private String model;
    private String busStatus;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private BigDecimal speed;
    private BigDecimal heading;
    private BigDecimal altitude;
    private LocalDateTime timestamp;
}
