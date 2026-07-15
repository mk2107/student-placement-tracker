package com.placementtracker.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class CompanyDTO {

    private Long id;

    @NotBlank(message = "Company name is required")
    private String companyName;

    @NotNull(message = "CTC is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "CTC must be greater than 0")
    private BigDecimal ctc;

    @NotBlank(message = "Location is required")
    private String location;

    @NotNull(message = "Eligibility CGPA is required")
    @DecimalMin(value = "0.0", message = "Eligibility CGPA cannot be negative")
    @DecimalMax(value = "10.0", message = "Eligibility CGPA cannot exceed 10")
    private BigDecimal eligibilityCgpa;

    @NotNull(message = "Last date to apply is required")
    private LocalDate lastDateToApply;
}
