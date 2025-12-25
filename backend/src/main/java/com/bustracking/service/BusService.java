package com.bustracking.service;

import com.bustracking.dto.request.BusRequest;
import com.bustracking.dto.response.BusResponse;
import com.bustracking.entity.Bus;
import com.bustracking.entity.Driver;
import com.bustracking.entity.Route;
import com.bustracking.repository.BusRepository;
import com.bustracking.repository.DriverRepository;
import com.bustracking.repository.RouteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service de gestion des bus
 */
@Service
@RequiredArgsConstructor
public class BusService {

    private final BusRepository busRepository;
    private final DriverRepository driverRepository;
    private final RouteRepository routeRepository;

    /**
     * Récupérer tous les bus
     */
    public List<BusResponse> getAllBuses() {
        return busRepository.findAllWithDetails().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Récupérer les bus actifs
     */
    public List<BusResponse> getActiveBuses() {
        return busRepository.findActiveBuses().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Récupérer un bus par ID
     */
    public BusResponse getBusById(Long id) {
        Bus bus = busRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bus non trouvé"));
        return mapToResponse(bus);
    }

    /**
     * Créer un bus
     */
    @Transactional
    public BusResponse createBus(BusRequest request) {
        Bus bus = Bus.builder()
                .busNumber(request.getBusNumber())
                .plateNumber(request.getPlateNumber())
                .model(request.getModel())
                .capacity(request.getCapacity())
                .year(request.getYear())
                .status(request.getStatus() != null ? request.getStatus().toLowerCase() : "active")
                .fuelType(request.getFuelType() != null ? request.getFuelType().toLowerCase() : "diesel")
                .build();

        if (request.getDriverId() != null) {
            Driver driver = driverRepository.findById(request.getDriverId())
                    .orElseThrow(() -> new RuntimeException("Conducteur non trouvé"));
            bus.setCurrentDriver(driver);
        }

        if (request.getRouteId() != null) {
            Route route = routeRepository.findById(request.getRouteId())
                    .orElseThrow(() -> new RuntimeException("Route non trouvée"));
            bus.setRoute(route);
        }

        bus = busRepository.save(bus);
        return mapToResponse(bus);
    }

    /**
     * Mettre à jour un bus
     */
    @Transactional
    public BusResponse updateBus(Long id, BusRequest request) {
        Bus bus = busRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bus non trouvé"));

        bus.setBusNumber(request.getBusNumber());
        bus.setPlateNumber(request.getPlateNumber());
        bus.setModel(request.getModel());
        bus.setCapacity(request.getCapacity());
        
        if (request.getYear() != null) {
            bus.setYear(request.getYear());
        }
        if (request.getStatus() != null) {
            bus.setStatus(request.getStatus());
        }
        if (request.getFuelType() != null) {
            bus.setFuelType(request.getFuelType());
        }
        if (request.getDriverId() != null) {
            Driver driver = driverRepository.findById(request.getDriverId())
                    .orElseThrow(() -> new RuntimeException("Conducteur non trouvé"));
            bus.setCurrentDriver(driver);
        }
        if (request.getRouteId() != null) {
            Route route = routeRepository.findById(request.getRouteId())
                    .orElseThrow(() -> new RuntimeException("Route non trouvée"));
            bus.setRoute(route);
        }

        bus = busRepository.save(bus);
        return mapToResponse(bus);
    }

    /**
     * Supprimer un bus
     */
    @Transactional
    public void deleteBus(Long id) {
        if (!busRepository.existsById(id)) {
            throw new RuntimeException("Bus non trouvé");
        }
        busRepository.deleteById(id);
    }

    /**
     * Mapper un bus vers sa réponse DTO
     */
    private BusResponse mapToResponse(Bus bus) {
        return BusResponse.builder()
                .id(bus.getId())
                .busNumber(bus.getBusNumber())
                .plateNumber(bus.getPlateNumber())
                .model(bus.getModel())
                .capacity(bus.getCapacity())
                .year(bus.getYear())
                .status(bus.getStatus())
                .fuelType(bus.getFuelType())
                .lastMaintenance(bus.getLastMaintenance())
                .nextMaintenance(bus.getNextMaintenance())
                .createdAt(bus.getCreatedAt())
                .updatedAt(bus.getUpdatedAt())
                .driverId(bus.getCurrentDriver() != null ? bus.getCurrentDriver().getId() : null)
                .driverName(bus.getCurrentDriver() != null && bus.getCurrentDriver().getUser() != null ? 
                        bus.getCurrentDriver().getUser().getName() : null)
                .routeId(bus.getRoute() != null ? bus.getRoute().getId() : null)
                .routeName(bus.getRoute() != null ? bus.getRoute().getName() : null)
                .build();
    }
}
