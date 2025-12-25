package com.bustracking.controller;

import com.bustracking.dto.PlateDetectionDTO;
import com.bustracking.entity.PlateDetection;
import com.bustracking.model.HealthResponse;
import com.bustracking.model.PlateDetectionRequest;
import com.bustracking.model.PlateDetectionResponse;
import com.bustracking.service.LicensePlateService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/license-plate")
public class LicensePlateController {

    @Autowired
    private LicensePlateService licensePlateService;

    @PostMapping("/detect")
    public ResponseEntity<PlateDetectionResponse> detectPlate(
            @Valid @RequestBody PlateDetectionRequest request) {

        PlateDetectionResponse response = licensePlateService.detectPlate(request);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @PostMapping("/checkin")
    public ResponseEntity<?> saveCheckIn(@RequestBody PlateDetectionDTO dto) {
        try {
            dto.setEventType("CHECK_IN");
            licensePlateService.savePlateDetection(dto);
            return ResponseEntity.ok().body("{\"message\": \"Check-in saved successfully\"}");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    @PostMapping("/checkout")
    public ResponseEntity<?> saveCheckOut(@RequestBody PlateDetectionDTO dto) {
        try {
            dto.setEventType("CHECK_OUT");
            licensePlateService.savePlateDetection(dto);
            return ResponseEntity.ok().body("{\"message\": \"Check-out saved successfully\"}");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }

    @GetMapping("/history")
    public ResponseEntity<List<PlateDetection>> getHistory() {
        return ResponseEntity.ok(licensePlateService.getRecentDetections());
    }

    @GetMapping("/health")
    public ResponseEntity<HealthResponse> healthCheck() {
        boolean aiServiceAvailable = licensePlateService.checkAiServiceHealth();

        HealthResponse response = new HealthResponse(
                "ok",
                aiServiceAvailable,
                aiServiceAvailable ? "All services operational" : "AI service unavailable");

        return ResponseEntity.ok(response);
    }
}
