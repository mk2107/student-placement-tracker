package com.placementtracker.controller;

import com.placementtracker.dto.ApiResponse;
import com.placementtracker.dto.ApplicationCreateDTO;
import com.placementtracker.dto.ApplicationResponseDTO;
import com.placementtracker.dto.ApplicationStatusUpdateDTO;
import com.placementtracker.entity.ApplicationStatus;
import com.placementtracker.service.ApplicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;

    // POST http://localhost:8080/api/applications  Body: { "studentId": 1, "companyId": 2 }
    @PostMapping
    public ApiResponse<ApplicationResponseDTO> createApplication(@Valid @RequestBody ApplicationCreateDTO dto) {
        return ApiResponse.success("Application submitted successfully", applicationService.createApplication(dto));
    }

    // GET http://localhost:8080/api/applications?status=SELECTED&studentId=1&companyId=2&page=0&size=10
    @GetMapping
    public ApiResponse<Page<ApplicationResponseDTO>> searchApplications(
            @RequestParam(required = false) ApplicationStatus status,
            @RequestParam(required = false) Long studentId,
            @RequestParam(required = false) Long companyId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("appliedDate").descending());
        return ApiResponse.success("Applications fetched successfully",
                applicationService.searchApplications(status, studentId, companyId, pageable));
    }

    // PATCH http://localhost:8080/api/applications/5/status  Body: { "status": "SELECTED" }
    @PatchMapping("/{id}/status")
    public ApiResponse<ApplicationResponseDTO> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody ApplicationStatusUpdateDTO dto
    ) {
        return ApiResponse.success("Application status updated successfully",
                applicationService.updateStatus(id, dto.getStatus()));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteApplication(@PathVariable Long id) {
        applicationService.deleteApplication(id);
        return ApiResponse.success("Application deleted successfully", null);
    }
}
