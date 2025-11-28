package com.bus.backend.websocket;

import com.bus.backend.repository.GpsTrackingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Component
@EnableScheduling
@RequiredArgsConstructor
public class GpsWebSocketHandler {

    private final SimpMessagingTemplate messagingTemplate;
    private final GpsTrackingRepository gpsTrackingRepository;

    @Scheduled(fixedDelay = 5000) // Broadcast every 5 seconds
    @Transactional(readOnly = true)
    @Cacheable(value = "latestGpsPositions", key = "'latest'")
    public void broadcastGpsUpdates() {
        var latestPositions = gpsTrackingRepository.findLatestPositions();
        
        if (!latestPositions.isEmpty()) {
            // Initialize lazy-loaded bus entities
            latestPositions.forEach(gps -> {
                if (gps.getBus() != null) {
                    gps.getBus().getRegistrationNumber(); // Force initialization
                }
            });
            
            messagingTemplate.convertAndSend("/topic/gps-updates", latestPositions);
            log.debug("Broadcast {} GPS positions", latestPositions.size());
        }
    }
}
