package com.placementtracker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Entry point of the Spring Boot application.
 * Running this class's main() method starts an embedded Tomcat server
 * on the port configured in application.properties (default 8080).
 */
@SpringBootApplication
public class PlacementTrackerApplication {

    public static void main(String[] args) {
        SpringApplication.run(PlacementTrackerApplication.class, args);
    }
}
