package com.tripwise;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = "com.tripwise")
@org.springframework.data.mongodb.repository.config.EnableReactiveMongoRepositories(basePackages = {
        "com.tripwise.session", "com.tripwise.reactive.repository" })
@org.springframework.data.mongodb.repository.config.EnableMongoRepositories(basePackages = "com.tripwise.repository")
public class TripwiseApplication {

    public static void main(String[] args) {
        SpringApplication.run(TripwiseApplication.class, args);
    }
}
