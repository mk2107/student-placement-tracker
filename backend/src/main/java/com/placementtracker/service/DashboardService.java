package com.placementtracker.service;

import com.placementtracker.dto.DashboardStatsDTO;
import com.placementtracker.entity.ApplicationStatus;
import com.placementtracker.repository.ApplicationRepository;
import com.placementtracker.repository.CompanyRepository;
import com.placementtracker.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final StudentRepository studentRepository;
    private final CompanyRepository companyRepository;
    private final ApplicationRepository applicationRepository;

    @Transactional(readOnly = true)
    public DashboardStatsDTO getStats() {
        long totalStudents = studentRepository.count();
        long totalCompanies = companyRepository.count();
        long totalApplications = applicationRepository.count();
        long selectedStudents = applicationRepository.countDistinctSelectedStudents();

        double placementPercentage = totalStudents == 0
                ? 0.0
                : Math.round((selectedStudents * 10000.0) / totalStudents) / 100.0; // 2 decimal places

        Map<String, Long> statusBreakdown = new LinkedHashMap<>();
        for (ApplicationStatus status : ApplicationStatus.values()) {
            statusBreakdown.put(status.name(), applicationRepository.countByStatus(status));
        }

        return new DashboardStatsDTO(
                totalStudents,
                totalCompanies,
                totalApplications,
                selectedStudents,
                placementPercentage,
                statusBreakdown
        );
    }
}
