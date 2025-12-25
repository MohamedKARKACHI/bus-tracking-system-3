package com.bustracking.model;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class HealthResponse {
    private String status;
    private boolean aiServiceAvailable;
    private String message;
}
