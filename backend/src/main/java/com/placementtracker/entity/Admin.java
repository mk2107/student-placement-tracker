package com.placementtracker.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "admins")
@Data               // Lombok: generates getters, setters, toString, equals, hashCode
@NoArgsConstructor   // Lombok: generates empty constructor (JPA requires this)
@AllArgsConstructor  // Lombok: generates a constructor with all fields
public class Admin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // mirrors AUTO_INCREMENT in MySQL
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String username;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    // We NEVER store plain-text passwords. This column holds a BCrypt hash.
    @Column(name = "password_hash", nullable = false, length = 255)
    private String passwordHash;

    @Column(name = "created_at", updatable = false, insertable = false)
    private LocalDateTime createdAt;
}
