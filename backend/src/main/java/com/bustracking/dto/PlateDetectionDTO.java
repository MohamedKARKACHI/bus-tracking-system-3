package com.bustracking.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlateDetectionDTO {
    private String plateNumber;
    private String serialNumber;
    private String arabicLetter;
    private String regionCode;

    // Helper for region code mapping if needed, but let's stick to standard naming
    public String getRequestCode() {
        return regionCode;
    }

    private Float confidence;
    private String eventType; // CHECK_IN, CHECK_OUT
}
