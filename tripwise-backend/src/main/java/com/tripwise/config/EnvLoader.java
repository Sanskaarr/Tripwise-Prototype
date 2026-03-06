package com.tripwise.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.util.StreamUtils;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

public class EnvLoader implements EnvironmentPostProcessor {

    private static final Logger logger = LoggerFactory.getLogger(EnvLoader.class);

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        // Check strictly in priority order:
        // 1. Current directory (standard behavior)
        // 2. tripwise-backend subdirectory (convenience for running from root)

        Resource[] resources = {
                new FileSystemResource(".env"),
                new FileSystemResource("tripwise-backend/.env")
        };

        Resource resource = null;
        for (Resource r : resources) {
            if (r.exists() && r.isReadable()) {
                resource = r;
                break;
            }
        }

        if (resource != null) {
            try {
                String content = StreamUtils.copyToString(resource.getInputStream(), StandardCharsets.UTF_8);
                Map<String, Object> envMap = new HashMap<>();

                for (String line : content.split("\n")) {
                    line = line.trim();
                    if (line.isEmpty() || line.startsWith("#")) {
                        continue;
                    }

                    String[] parts = line.split("=", 2);
                    if (parts.length == 2) {
                        String key = parts[0].trim();
                        String value = parts[1].trim();
                        envMap.put(key, value);
                        System.setProperty(key, value);
                    }
                }

                // Create a property source from the map
                MapPropertySource propertySource = new MapPropertySource("env", envMap);

                environment.getPropertySources().addFirst(propertySource);
                logger.info("✅ Loaded {} environment variables from {}", envMap.size(), resource.getDescription());

            } catch (IOException e) {
                logger.error("❌ Failed to load .env file: {}", e.getMessage());
            }
        } else {
            logger.warn(
                    "⚠️  .env file not found in current directory or tripwise-backend/ subdirectory. Using system environment variables.");
        }
    }
}
