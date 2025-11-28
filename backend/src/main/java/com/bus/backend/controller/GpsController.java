package com.bus.backend.controller;

import com.bus.backend.model.GpsTracking;
import com.bus.backend.repository.GpsTrackingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/gps")
@RequiredArgsConstructor
public class GpsController {

    private final GpsTrackingRepository gpsTrackingRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @GetMapping("/latest")
    @Cacheable(value = "latestGpsPositions", key = "'all'")
    public ResponseEntity<List<GpsTracking>> getLatestPositions() {
        return ResponseEntity.ok(gpsTrackingRepository.findLatestPositions());
    }

    @GetMapping("/bus/{busId}/history")
    @Cacheable(value = "gpsTracking", key = "#busId")
    public ResponseEntity<List<GpsTracking>> getBusHistory(@PathVariable Long busId) {
        return ResponseEntity.ok(
            gpsTrackingRepository.findByBusIdOrderByTimestampDesc(busId)
        );
    }

    @PostMapping("/update")
    @CacheEvict(value = {"gpsTracking", "latestGpsPositions"}, allEntries = true)
    public ResponseEntity<GpsTracking> updateGpsPosition(@RequestBody GpsTracking gpsTracking) {
        GpsTracking saved = gpsTrackingRepository.save(gpsTracking);
        
        // Broadcast to WebSocket subscribers
        messagingTemplate.convertAndSend("/topic/gps-updates", saved);
        
        return ResponseEntity.ok(saved);
    }
}
