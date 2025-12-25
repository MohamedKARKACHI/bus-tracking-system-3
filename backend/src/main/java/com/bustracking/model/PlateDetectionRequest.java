package com.bustracking.model;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PlateDetectionRequest {
    @NotBlank(message = "Image data is required")
    private String image; // Base64 encoded image
}
