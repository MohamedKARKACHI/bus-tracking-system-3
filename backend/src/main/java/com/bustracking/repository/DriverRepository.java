package com.bustracking.repository;

import com.bustracking.entity.Driver;
import com.bustracking.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository pour l'entité Driver
 */
@Repository
public interface DriverRepository extends JpaRepository<Driver, Long> {
    
    Optional<Driver> findByUser(User user);
    
    Optional<Driver> findByUserId(Long userId);
    
    Optional<Driver> findByLicenseNumber(String licenseNumber);
    
    List<Driver> findByStatus(Driver.Status status);
    
    @Query("SELECT d FROM Driver d WHERE d.status = 'available'")
    List<Driver> findAvailableDrivers();
    
    @Query("SELECT d FROM Driver d JOIN FETCH d.user ORDER BY d.user.firstName")
    List<Driver> findAllWithUser();
}
