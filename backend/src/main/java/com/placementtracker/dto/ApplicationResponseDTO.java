package com.placementtracker.dto;

import com.placementtracker.entity.ApplicationStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * We deliberately do NOT return the raw Application entity from our controllers.
 * The entity holds full Student and Company objects (lazy-loaded), which would
 * either throw LazyInitializationException outside a transaction, or serialize
 * huge nested JSON. Instead we flatten just the fields the UI table needs.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationResponseDTO {
    private Long id;
    private Long studentId;
    private String studentName;
    private String studentRollNumber;
    private Long companyId;
    private String companyName;
    private ApplicationStatus status;
    private LocalDateTime appliedDate;
}
