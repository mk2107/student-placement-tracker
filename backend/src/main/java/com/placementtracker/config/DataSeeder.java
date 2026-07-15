package com.placementtracker.config;

import com.placementtracker.entity.Admin;
import com.placementtracker.repository.AdminRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * CommandLineRunner's run() method executes exactly once, automatically,
 * right after the Spring Boot application finishes starting up.
 *
 * We use it here to create a default admin account IF one doesn't already
 * exist. This is safer than hand-writing a BCrypt hash into a SQL script -
 * BCrypt hashes include a random salt, and generating one by hand risks
 * getting it subtly wrong (which would silently break login).
 *
 * Default login after first run: username = admin, password = Admin@123
 * Change this password after logging in for the first time in a real deployment.
 */
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (adminRepository.findByUsername("admin").isEmpty()) {
            Admin admin = new Admin();
            admin.setUsername("admin");
            admin.setEmail("admin@placementcell.edu");
            admin.setPasswordHash(passwordEncoder.encode("Admin@123"));
            adminRepository.save(admin);
            System.out.println(">>> Default admin created: username='admin', password='Admin@123'");
        }
    }
}
