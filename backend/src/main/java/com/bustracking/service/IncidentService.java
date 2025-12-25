package com.bustracking.service;

import com.bustracking.dto.request.IncidentRequest;
import com.bustracking.entity.Bus;
import com.bustracking.entity.Driver;
import com.bustracking.entity.Incident;
import com.bustracking.entity.Schedule;
import com.bustracking.repository.BusRepository;
import com.bustracking.repository.DriverRepository;
import com.bustracking.repository.IncidentRepository;
import com.bustracking.repository.ScheduleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Service de gestion des incidents
 */
@Service
@RequiredArgsConstructor
public class IncidentService {

    private final IncidentRepository incidentRepository;
    private final BusRepository busRepository;
    private final DriverRepository driverRepository;
    private final ScheduleRepository scheduleRepository;

    /**
     * Récupérer tous les incidents
     */
    public List<Incident> getAllIncidents() {
        return incidentRepository.findAllWithDetails();
    }

    /**
     * Récupérer les incidents actifs
     */
    public List<Incident> getActiveIncidents() {
        return incidentRepository.findActiveIncidents();
    }

    /**
     * Récupérer un incident par ID
     */
    public Incident getIncidentById(Long id) {
        return incidentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Incident non trouvé"));
    }

    /**
     * Créer un incident
     */
    @Transactional
    public Incident createIncident(IncidentRequest request) {
        Bus bus = busRepository.findById(request.getBusId())
                .orElseThrow(() -> new RuntimeException("Bus non trouvé"));

        Driver driver = driverRepository.findById(request.getDriverId())
                .orElseThrow(() -> new RuntimeException("Conducteur non trouvé"));

        Incident incident = Incident.builder()
                .bus(bus)
                .driver(driver)
                .incidentType(Incident.IncidentType.valueOf(request.getIncidentType()))
                .description(request.getDescription())
                .severity(request.getSeverity() != null ? 
                        Incident.Severity.valueOf(request.getSeverity()) : Incident.Severity.low)
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .status(Incident.Status.reported)
                .build();

        if (request.getScheduleId() != null) {
            Schedule schedule = scheduleRepository.findById(request.getScheduleId())
                    .orElse(null);
            incident.setSchedule(schedule);
        }

        return incidentRepository.save(incident);
    }

    /**
     * Mettre à jour le statut d'un incident
     */
    @Transactional
    public Incident updateIncidentStatus(Long id, String status) {
        Incident incident = getIncidentById(id);
        incident.setStatus(Incident.Status.valueOf(status));
        
        if (status.equals("resolved") || status.equals("closed")) {
            incident.setResolvedAt(LocalDateTime.now());
        }
        
        return incidentRepository.save(incident);
    }
}
