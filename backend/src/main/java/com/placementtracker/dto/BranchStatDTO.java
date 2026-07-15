package com.placementtracker.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BranchStatDTO {
    private String branch;
    private long totalStudents;
    private long selectedStudents;
    private double placementPercentage;
}
