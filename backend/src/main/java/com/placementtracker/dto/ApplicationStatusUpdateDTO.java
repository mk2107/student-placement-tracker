package com.placementtracker.dto;

import com.placementtracker.entity.ApplicationStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ApplicationStatusUpdateDTO {

    @NotNull(message = "Status is required")
    private ApplicationStatus status;
}
