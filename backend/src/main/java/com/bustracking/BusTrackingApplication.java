package com.bustracking;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Application principale du Système de Suivi de Bus en Temps Réel
 * 
 * @author Mohamed KARKACHI
 * @version 1.0.0
 */
@SpringBootApplication
@EnableScheduling
public class BusTrackingApplication {

    public static void main(String[] args) {
        SpringApplication.run(BusTrackingApplication.class, args);
        System.out.println("🚀 Bus Tracking System Backend started successfully!");
        System.out.println("📡 Server running on http://localhost:4000");
        System.out.println("🔌 WebSocket enabled for real-time GPS tracking");
    }
}
