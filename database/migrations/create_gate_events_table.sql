-- Gate Events Table for real Check-in/Check-out persistence
-- Records plate detections linked to buses/drivers when possible

CREATE TABLE IF NOT EXISTS gate_events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bus_id INT NULL,
    driver_id INT NULL,
    plate_number VARCHAR(50) NOT NULL,
    event_type ENUM('check_in','check_out') NOT NULL,
    confidence DECIMAL(5,2) NULL,
    source ENUM('camera','upload','simulation','websocket') DEFAULT 'camera',
    detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_event_type (event_type),
    INDEX idx_plate_number (plate_number),
    INDEX idx_detected_at (detected_at),
    CONSTRAINT fk_gate_events_bus FOREIGN KEY (bus_id) REFERENCES buses(id) ON DELETE SET NULL,
    CONSTRAINT fk_gate_events_driver FOREIGN KEY (driver_id) REFERENCES drivers(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
