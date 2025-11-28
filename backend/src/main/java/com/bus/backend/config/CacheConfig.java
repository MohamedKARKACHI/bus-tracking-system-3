package com.bus.backend.config;

import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableCaching
public class CacheConfig {
    // Ehcache configuration will be loaded from ehcache.xml
}
