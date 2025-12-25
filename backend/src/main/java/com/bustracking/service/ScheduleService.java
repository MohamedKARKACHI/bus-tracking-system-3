package com.bustracking.service;

import com.bustracking.entity.Schedule;
import com.bustracking.repository.ScheduleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service de gestion des plannings
 */
@Service
@RequiredArgsConstructor
public class ScheduleService {

    private final ScheduleRepository scheduleRepository;

    /**
     * Récupérer tous les plannings
     */
    public List<Schedule> getAllSchedules() {
        return scheduleRepository.findAllWithDetails();
    }

    /**
     * Récupérer un planning par ID
     */
    public Schedule getScheduleById(Long id) {
        return scheduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Planning non trouvé"));
    }

    /**
     * Récupérer les plannings actifs
     */
    public List<Schedule> getActiveSchedules() {
        return scheduleRepository.findActiveSchedules();
    }

    /**
     * Récupérer les plannings par bus
     */
    public List<Schedule> getSchedulesByBus(Long busId) {
        return scheduleRepository.findByBusId(busId);
    }

    /**
     * Récupérer les plannings par conducteur
     */
    public List<Schedule> getSchedulesByDriver(Long driverId) {
        return scheduleRepository.findByDriverId(driverId);
    }
}
