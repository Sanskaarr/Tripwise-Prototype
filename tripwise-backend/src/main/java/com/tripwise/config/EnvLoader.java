package com.tripwise.config;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.PropertySource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.util.StreamUtils;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

public class EnvLoader implements EnvironmentPostProcessor {

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

                PropertySource<?> propertySource = new PropertySource<Map<String, Object>>("env", envMap) {
                    @Override
                    public Object getProperty(String name) {
                        return envMap.get(name);
                    }
                };

                environment.getPropertySources().addFirst(propertySource);
                System.out.println(
                        "✅ Loaded " + envMap.size() + " environment variables from " + resource.getDescription());

            } catch (IOException e) {
                System.err.println("❌ Failed to load .env file: " + e.getMessage());
            }
        } else {
            System.out.println(
                    "⚠️  .env file not found in current directory or tripwise-backend/ subdirectory. Using system environment variables.");
        }
    }
}
