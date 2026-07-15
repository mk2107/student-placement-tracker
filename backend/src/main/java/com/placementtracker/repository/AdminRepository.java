package com.placementtracker.repository;

import com.placementtracker.entity.Admin;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

// Extending JpaRepository<Admin, Long> gives us save(), findById(), findAll(),
// deleteById() etc. for free - no SQL written by us for basic CRUD.
public interface AdminRepository extends JpaRepository<Admin, Long> {

    // Spring Data JPA generates the SQL for this automatically just from the method name:
    // "SELECT * FROM admins WHERE username = ?"
    Optional<Admin> findByUsername(String username);
}
