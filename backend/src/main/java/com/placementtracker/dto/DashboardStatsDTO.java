package com.placementtracker.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDTO {
    private long totalStudents;
    private long totalCompanies;
    private long totalApplications;
    private long selectedStudents;
    private double placementPercentage;

    // Breakdown of applications by status, e.g. {"APPLIED": 12, "SHORTLISTED": 4, ...}
    // - powers the pipeline visual and status chart on the dashboard.
    private java.util.Map<String, Long> applicationsByStatus;
}
