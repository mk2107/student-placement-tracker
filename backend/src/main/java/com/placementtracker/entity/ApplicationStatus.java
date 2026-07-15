package com.placementtracker.entity;

/**
 * Mirrors the ENUM('APPLIED', 'SHORTLISTED', ...) column in the applications table.
 * Using a Java enum here means the compiler (not just the database) stops us
 * from ever assigning an invalid status.
 */
public enum ApplicationStatus {
    APPLIED,
    SHORTLISTED,
    INTERVIEW_SCHEDULED,
    SELECTED,
    REJECTED
}
