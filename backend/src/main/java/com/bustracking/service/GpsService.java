package com.bustracking.service;

import com.bustracking.dto.request.GpsUpdateRequest;
import com.bustracking.dto.response.GpsResponse;
import com.bustracking.entity.Bus;
import com.bustracking.entity.GpsTracking;
import com.bustracking.entity.Schedule;
import com.bustracking.repository.BusRepository;
import com.bustracking.repository.GpsTrackingRepository;
import com.bustracking.repository.ScheduleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service de gestion du suivi GPS
 */
@Service
@RequiredArgsConstructor
public class GpsService {

    private final GpsTrackingRepository gpsTrackingRepository;
    private final BusRepository busRepository;
    private final ScheduleRepository scheduleRepository;
    private final SimpMessagingTemplate messagingTemplate;

    /**
     * Récupérer les dernières positions de tous les bus
     */
    public List<GpsResponse> getLatestPositions() {
        return gpsTrackingRepository.findLatestForAllBuses().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Récupérer l'historique GPS d'un bus
     */
    public List<GpsResponse> getBusHistory(Long busId, int limit) {
        return gpsTrackingRepository.findByBusIdOrderByTimestampDesc(busId, PageRequest.of(0, limit))
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Récupérer la dernière position d'un bus
     */
    public GpsResponse getLatestPosition(Long busId) {
        return gpsTrackingRepository.findLatestByBusId(busId)
                .map(this::mapToResponse)
                .orElseThrow(() -> new RuntimeException("Aucune position GPS trouvée pour ce bus"));
    }

    /**
     * Mettre à jour la position GPS d'un bus
     */
    @Transactional
    public GpsResponse updatePosition(GpsUpdateRequest request) {
        Bus bus = busRepository.findById(request.getBusId())
                .orElseThrow(() -> new RuntimeException("Bus non trouvé"));

        GpsTracking gpsTracking = GpsTracking.builder()
                .bus(bus)
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .speed(request.getSpeed())
                .heading(request.getHeading())
                .altitude(request.getAltitude())
                .build();

        if (request.getScheduleId() != null) {
            Schedule schedule = scheduleRepository.findById(request.getScheduleId())
                    .orElse(null);
            gpsTracking.setSchedule(schedule);
        }

        gpsTracking = gpsTrackingRepository.save(gpsTracking);
        GpsResponse response = mapToResponse(gpsTracking);

        // Diffuser la mise à jour en temps réel via WebSocket
        broadcastGpsUpdate(response);

        return response;
    }

    /**
     * Diffuser une mise à jour GPS via WebSocket
     */
    private void broadcastGpsUpdate(GpsResponse gpsResponse) {
        // Diffuser à tous les abonnés du topic GPS
        messagingTemplate.convertAndSend("/topic/gps-updates", gpsResponse);
        
        // Diffuser aux abonnés du bus spécifique
        messagingTemplate.convertAndSend("/topic/bus/" + gpsResponse.getBusId(), gpsResponse);
    }

    /**
     * Mapper un GpsTracking vers sa réponse DTO
     */
    private GpsResponse mapToResponse(GpsTracking gps) {
        Bus bus = gps.getBus();
        return GpsResponse.builder()
                .id(gps.getId())
                .busId(bus.getId())
                .busNumber(bus.getBusNumber())
                .plateNumber(bus.getPlateNumber())
                .model(bus.getModel())
                .busStatus(bus.getStatus())
                .latitude(gps.getLatitude())
                .longitude(gps.getLongitude())
                .speed(gps.getSpeed())
                .heading(gps.getHeading())
                .altitude(gps.getAltitude())
                .timestamp(gps.getTimestamp())
                .build();
    }
}
