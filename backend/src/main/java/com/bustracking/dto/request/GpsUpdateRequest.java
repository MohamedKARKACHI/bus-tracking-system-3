package com.bustracking.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

/**
 * DTO pour la mise à jour GPS
 */
@Data
public class GpsUpdateRequest {
    
    @NotNull(message = "L'ID du bus est obligatoire")
    private Long busId;
    
    @NotNull(message = "La latitude est obligatoire")
    private BigDecimal latitude;
    
    @NotNull(message = "La longitude est obligatoire")
    private BigDecimal longitude;
    
    private BigDecimal speed;
    
    private BigDecimal heading;
    
    private BigDecimal altitude;
    
    private Long scheduleId;
}
