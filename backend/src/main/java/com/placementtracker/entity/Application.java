package com.placementtracker.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "applications", uniqueConstraints = {
        // Mirrors the composite UNIQUE(student_id, company_id) constraint in schema.sql -
        // a student can only have one application row per company.
        @UniqueConstraint(name = "unique_student_company", columnNames = {"student_id", "company_id"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Many applications belong to one student. FetchType.LAZY means Hibernate
    // only loads the Student row when .getStudent() is actually called,
    // instead of always eagerly joining - important for performance.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @Enumerated(EnumType.STRING) // store the enum's NAME ("APPLIED"), not its ordinal number (0,1,2..)
    @Column(nullable = false, length = 30)
    private ApplicationStatus status = ApplicationStatus.APPLIED;

    @Column(name = "applied_date", updatable = false, insertable = false)
    private LocalDateTime appliedDate;

    @Column(name = "updated_at", insertable = false)
    private LocalDateTime updatedAt;
}
