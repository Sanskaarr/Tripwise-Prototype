package com.tripwise;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = "com.tripwise")
public class TripwiseApplication {

    public static void main(String[] args) {
        SpringApplication.run(TripwiseApplication.class, args);
    }
}
