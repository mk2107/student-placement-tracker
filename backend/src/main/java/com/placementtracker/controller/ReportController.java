package com.placementtracker.controller;

import com.placementtracker.dto.ApiResponse;
import com.placementtracker.dto.BranchStatDTO;
import com.placementtracker.dto.CompanyReportDTO;
import com.placementtracker.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    // GET http://localhost:8080/api/reports/branch-wise
    @GetMapping("/branch-wise")
    public ApiResponse<List<BranchStatDTO>> getBranchWiseStats() {
        return ApiResponse.success("Branch-wise report fetched successfully", reportService.getBranchWiseStats());
    }

    // GET http://localhost:8080/api/reports/company-wise
    @GetMapping("/company-wise")
    public ApiResponse<List<CompanyReportDTO>> getCompanyWiseStats() {
        return ApiResponse.success("Company-wise report fetched successfully", reportService.getCompanyWiseSelectedStudents());
    }
}
