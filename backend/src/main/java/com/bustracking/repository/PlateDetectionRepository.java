package com.bustracking.repository;

import com.bustracking.entity.PlateDetection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlateDetectionRepository extends JpaRepository<PlateDetection, Long> {
    List<PlateDetection> findTop50ByOrderByTimestampDesc();
}
