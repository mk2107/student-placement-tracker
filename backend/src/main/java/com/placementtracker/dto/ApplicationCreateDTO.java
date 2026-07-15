package com.placementtracker.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ApplicationCreateDTO {

    @NotNull(message = "Student is required")
    private Long studentId;

    @NotNull(message = "Company is required")
    private Long companyId;
}
