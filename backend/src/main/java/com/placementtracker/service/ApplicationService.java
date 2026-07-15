package com.placementtracker.service;

import com.placementtracker.dto.ApplicationCreateDTO;
import com.placementtracker.dto.ApplicationResponseDTO;
import com.placementtracker.entity.Application;
import com.placementtracker.entity.ApplicationStatus;
import com.placementtracker.entity.Company;
import com.placementtracker.entity.Student;
import com.placementtracker.exception.DuplicateResourceException;
import com.placementtracker.exception.ResourceNotFoundException;
import com.placementtracker.repository.ApplicationRepository;
import com.placementtracker.repository.CompanyRepository;
import com.placementtracker.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final StudentRepository studentRepository;
    private final CompanyRepository companyRepository;

    @Transactional
    public ApplicationResponseDTO createApplication(ApplicationCreateDTO dto) {
        if (applicationRepository.existsByStudentIdAndCompanyId(dto.getStudentId(), dto.getCompanyId())) {
            throw new DuplicateResourceException("This student has already applied to this company");
        }

        Student student = studentRepository.findById(dto.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + dto.getStudentId()));
        Company company = companyRepository.findById(dto.getCompanyId())
                .orElseThrow(() -> new ResourceNotFoundException("Company not found with id: " + dto.getCompanyId()));

        Application application = new Application();
        application.setStudent(student);
        application.setCompany(company);
        application.setStatus(ApplicationStatus.APPLIED);

        return toDto(applicationRepository.save(application));
    }

    @Transactional(readOnly = true)
    public Page<ApplicationResponseDTO> searchApplications(ApplicationStatus status, Long studentId, Long companyId, Pageable pageable) {
        return applicationRepository.searchAndFilter(status, studentId, companyId, pageable).map(this::toDto);
    }

    @Transactional
    public ApplicationResponseDTO updateStatus(Long id, ApplicationStatus newStatus) {
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + id));
        application.setStatus(newStatus);
        return toDto(applicationRepository.save(application));
    }

    @Transactional
    public void deleteApplication(Long id) {
        if (!applicationRepository.existsById(id)) {
            throw new ResourceNotFoundException("Application not found with id: " + id);
        }
        applicationRepository.deleteById(id);
    }

    private ApplicationResponseDTO toDto(Application a) {
        return new ApplicationResponseDTO(
                a.getId(),
                a.getStudent().getId(),
                a.getStudent().getName(),
                a.getStudent().getRollNumber(),
                a.getCompany().getId(),
                a.getCompany().getCompanyName(),
                a.getStatus(),
                a.getAppliedDate()
        );
    }
}
