package com.bus.backend.controller;

import com.bus.backend.model.Bus;
import com.bus.backend.repository.BusRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/buses")
@RequiredArgsConstructor
public class BusController {

    private final BusRepository busRepository;

    @GetMapping
    @Cacheable(value = "buses", key = "'all'")
    public ResponseEntity<List<Bus>> getAllBuses() {
        return ResponseEntity.ok(busRepository.findAll());
    }

    @GetMapping("/{id}")
    @Cacheable(value = "buses", key = "#id")
    public ResponseEntity<Bus> getBusById(@PathVariable Long id) {
        return busRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @CacheEvict(value = "buses", allEntries = true)
    public ResponseEntity<Bus> createBus(@RequestBody Bus bus) {
        Bus savedBus = busRepository.save(bus);
        return ResponseEntity.ok(savedBus);
    }

    @PutMapping("/{id}")
    @CacheEvict(value = "buses", allEntries = true)
    public ResponseEntity<Bus> updateBus(@PathVariable Long id, @RequestBody Bus bus) {
        return busRepository.findById(id)
                .map(existingBus -> {
                    bus.setId(id);
                    return ResponseEntity.ok(busRepository.save(bus));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @CacheEvict(value = "buses", allEntries = true)
    public ResponseEntity<Void> deleteBus(@PathVariable Long id) {
        if (busRepository.existsById(id)) {
            busRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
