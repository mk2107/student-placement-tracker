package com.placementtracker.service;

import com.placementtracker.dto.CompanyDTO;
import com.placementtracker.entity.Company;
import com.placementtracker.exception.ResourceNotFoundException;
import com.placementtracker.repository.CompanyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CompanyService {

    private final CompanyRepository companyRepository;

    @Transactional
    public CompanyDTO createCompany(CompanyDTO dto) {
        Company company = toEntity(dto);
        return toDto(companyRepository.save(company));
    }

    @Transactional(readOnly = true)
    public CompanyDTO getCompanyById(Long id) {
        return toDto(findCompanyOrThrow(id));
    }

    @Transactional(readOnly = true)
    public Page<CompanyDTO> searchCompanies(String keyword, Pageable pageable) {
        return companyRepository.search(keyword, pageable).map(this::toDto);
    }

    @Transactional
    public CompanyDTO updateCompany(Long id, CompanyDTO dto) {
        Company existing = findCompanyOrThrow(id);
        existing.setCompanyName(dto.getCompanyName());
        existing.setCtc(dto.getCtc());
        existing.setLocation(dto.getLocation());
        existing.setEligibilityCgpa(dto.getEligibilityCgpa());
        existing.setLastDateToApply(dto.getLastDateToApply());
        return toDto(companyRepository.save(existing));
    }

    @Transactional
    public void deleteCompany(Long id) {
        Company company = findCompanyOrThrow(id);
        companyRepository.delete(company); // cascades to delete related applications
    }

    private Company findCompanyOrThrow(Long id) {
        return companyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found with id: " + id));
    }

    private CompanyDTO toDto(Company c) {
        CompanyDTO dto = new CompanyDTO();
        dto.setId(c.getId());
        dto.setCompanyName(c.getCompanyName());
        dto.setCtc(c.getCtc());
        dto.setLocation(c.getLocation());
        dto.setEligibilityCgpa(c.getEligibilityCgpa());
        dto.setLastDateToApply(c.getLastDateToApply());
        return dto;
    }

    private Company toEntity(CompanyDTO dto) {
        Company c = new Company();
        c.setCompanyName(dto.getCompanyName());
        c.setCtc(dto.getCtc());
        c.setLocation(dto.getLocation());
        c.setEligibilityCgpa(dto.getEligibilityCgpa());
        c.setLastDateToApply(dto.getLastDateToApply());
        return c;
    }
}
