package com.placementtracker.service;

import com.placementtracker.dto.BranchStatDTO;
import com.placementtracker.dto.CompanyReportDTO;
import com.placementtracker.repository.ApplicationRepository;
import com.placementtracker.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final StudentRepository studentRepository;
    private final ApplicationRepository applicationRepository;

    @Transactional(readOnly = true)
    public List<BranchStatDTO> getBranchWiseStats() {
        // Build a lookup of branch -> selected count from the grouped query.
        Map<String, Long> selectedByBranch = new HashMap<>();
        for (Object[] row : applicationRepository.countSelectedStudentsGroupedByBranch()) {
            selectedByBranch.put((String) row[0], (Long) row[1]);
        }

        List<BranchStatDTO> result = new ArrayList<>();
        for (String branch : studentRepository.findDistinctBranches()) {
            long total = studentRepository.countByBranch(branch);
            long selected = selectedByBranch.getOrDefault(branch, 0L);
            double percentage = total == 0 ? 0.0 : Math.round((selected * 10000.0) / total) / 100.0;
            result.add(new BranchStatDTO(branch, total, selected, percentage));
        }
        return result;
    }

    @Transactional(readOnly = true)
    public List<CompanyReportDTO> getCompanyWiseSelectedStudents() {
        List<CompanyReportDTO> result = new ArrayList<>();
        for (Object[] row : applicationRepository.countSelectedGroupedByCompany()) {
            result.add(new CompanyReportDTO((String) row[0], (Long) row[1]));
        }
        return result;
    }
}
