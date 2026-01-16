package com.tripwise.service;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class CacheService {
    
    private static final Logger logger = LoggerFactory.getLogger(CacheService.class);
    
    // Simple in-memory cache with TTL
    private final ConcurrentHashMap<String, CacheEntry> cache = new ConcurrentHashMap<>();
    
    private static final long CACHE_TTL_HOURS = 6; // 6 hours cache for fresh data
    
    public String get(String key) {
        CacheEntry entry = cache.get(key);
        if (entry == null) {
            return null;
        }
        
        if (System.currentTimeMillis() > entry.expiryTime) {
            cache.remove(key);
            logger.debug("Cache expired for key: {}", key);
            return null;
        }
        
        logger.debug("Cache hit for key: {}", key);
        return entry.value;
    }
    
    public void put(String key, String value) {
        long expiryTime = System.currentTimeMillis() + TimeUnit.HOURS.toMillis(CACHE_TTL_HOURS);
        cache.put(key, new CacheEntry(value, expiryTime));
        logger.debug("Cached value for key: {}", key);
    }
    
    public boolean contains(String key) {
        return get(key) != null;
    }
    
    public void clear() {
        cache.clear();
        logger.info("Cache cleared");
    }
    
    private static class CacheEntry {
        final String value;
        final long expiryTime;
        
        CacheEntry(String value, long expiryTime) {
            this.value = value;
            this.expiryTime = expiryTime;
        }
    }
}
