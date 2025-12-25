package com.bustracking.scheduler;

import com.bustracking.dto.response.GpsResponse;
import com.bustracking.service.GpsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Tâches planifiées pour la diffusion GPS
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class GpsBroadcastScheduler {

    private final GpsService gpsService;
    private final SimpMessagingTemplate messagingTemplate;

    /**
     * Diffuser les positions GPS toutes les 5 secondes
     */
    @Scheduled(fixedRate = 5000)
    @Transactional(readOnly = true)
    public void broadcastGpsPositions() {
        try {
            List<GpsResponse> positions = gpsService.getLatestPositions();
            if (!positions.isEmpty()) {
                messagingTemplate.convertAndSend("/topic/gps-updates", positions);
                log.debug("Broadcast {} GPS positions", positions.size());
            }
        } catch (Exception e) {
            log.error("Error broadcasting GPS positions: {}", e.getMessage());
        }
    }
}
