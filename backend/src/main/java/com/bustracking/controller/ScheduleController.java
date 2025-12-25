package com.bustracking.controller;

import com.bustracking.dto.response.ApiResponse;
import com.bustracking.entity.Schedule;
import com.bustracking.service.ScheduleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Contrôleur REST pour la gestion des plannings
 */
@RestController
@RequestMapping("/api/schedules")
@RequiredArgsConstructor
public class ScheduleController {

    private final ScheduleService scheduleService;

    /**
     * Récupérer tous les plannings
     * GET /api/schedules
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<Schedule>>> getAllSchedules() {
        List<Schedule> schedules = scheduleService.getAllSchedules();
        return ResponseEntity.ok(ApiResponse.success(schedules));
    }

    /**
     * Récupérer un planning par ID
     * GET /api/schedules/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Schedule>> getScheduleById(@PathVariable Long id) {
        try {
            Schedule schedule = scheduleService.getScheduleById(id);
            return ResponseEntity.ok(ApiResponse.success(schedule));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Récupérer les plannings actifs
     * GET /api/schedules/active
     */
    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<Schedule>>> getActiveSchedules() {
        List<Schedule> schedules = scheduleService.getActiveSchedules();
        return ResponseEntity.ok(ApiResponse.success(schedules));
    }

    /**
     * Récupérer les plannings par bus
     * GET /api/schedules/bus/{busId}
     */
    @GetMapping("/bus/{busId}")
    public ResponseEntity<ApiResponse<List<Schedule>>> getSchedulesByBus(@PathVariable Long busId) {
        List<Schedule> schedules = scheduleService.getSchedulesByBus(busId);
        return ResponseEntity.ok(ApiResponse.success(schedules));
    }

    /**
     * Récupérer les plannings par conducteur
     * GET /api/schedules/driver/{driverId}
     */
    @GetMapping("/driver/{driverId}")
    public ResponseEntity<ApiResponse<List<Schedule>>> getSchedulesByDriver(@PathVariable Long driverId) {
        List<Schedule> schedules = scheduleService.getSchedulesByDriver(driverId);
        return ResponseEntity.ok(ApiResponse.success(schedules));
    }
}
