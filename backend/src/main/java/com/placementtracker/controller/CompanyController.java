package com.placementtracker.controller;

import com.placementtracker.dto.ApiResponse;
import com.placementtracker.dto.CompanyDTO;
import com.placementtracker.service.CompanyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/companies")
@RequiredArgsConstructor
public class CompanyController {

    private final CompanyService companyService;

    @PostMapping
    public ApiResponse<CompanyDTO> createCompany(@Valid @RequestBody CompanyDTO dto) {
        return ApiResponse.success("Company created successfully", companyService.createCompany(dto));
    }

    @GetMapping("/{id}")
    public ApiResponse<CompanyDTO> getCompany(@PathVariable Long id) {
        return ApiResponse.success("Company fetched successfully", companyService.getCompanyById(id));
    }

    @GetMapping
    public ApiResponse<Page<CompanyDTO>> searchCompanies(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "companyName") String sortBy
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy).ascending());
        return ApiResponse.success("Companies fetched successfully", companyService.searchCompanies(keyword, pageable));
    }

    @PutMapping("/{id}")
    public ApiResponse<CompanyDTO> updateCompany(@PathVariable Long id, @Valid @RequestBody CompanyDTO dto) {
        return ApiResponse.success("Company updated successfully", companyService.updateCompany(id, dto));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteCompany(@PathVariable Long id) {
        companyService.deleteCompany(id);
        return ApiResponse.success("Company deleted successfully", null);
    }
}
