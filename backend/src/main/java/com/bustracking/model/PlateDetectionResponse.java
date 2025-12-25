package com.bustracking.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlateDetectionResponse {
    private boolean success;
    private String serial;
    private String letter;
    private String region;
    private String fullResult;
    private Long timestamp;
    private String processedImage; // Base64 encoded processed image
    private String error;
}
