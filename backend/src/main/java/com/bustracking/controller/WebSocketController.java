package com.bustracking.controller;

import com.bustracking.dto.request.GpsUpdateRequest;
import com.bustracking.dto.response.GpsResponse;
import com.bustracking.service.GpsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

/**
 * Contrôleur WebSocket pour le suivi GPS en temps réel
 */
@Controller
@RequiredArgsConstructor
@Slf4j
public class WebSocketController {

    private final GpsService gpsService;
    private final SimpMessagingTemplate messagingTemplate;

    /**
     * Recevoir une mise à jour GPS via WebSocket
     * /app/gps/update -> /topic/gps-updates
     */
    @MessageMapping("/gps/update")
    @SendTo("/topic/gps-updates")
    public GpsResponse handleGpsUpdate(GpsUpdateRequest request) {
        log.info("Received GPS update for bus: {}", request.getBusId());
        return gpsService.updatePosition(request);
    }

    /**
     * S'abonner aux mises à jour d'un bus spécifique
     * /app/subscribe/bus/{busId}
     */
    @MessageMapping("/subscribe/bus")
    public void subscribeToBus(Long busId) {
        log.info("Client subscribed to bus: {}", busId);
        try {
            GpsResponse latestPosition = gpsService.getLatestPosition(busId);
            messagingTemplate.convertAndSend("/topic/bus/" + busId, latestPosition);
        } catch (RuntimeException e) {
            log.warn("No GPS data available for bus: {}", busId);
        }
    }
}
