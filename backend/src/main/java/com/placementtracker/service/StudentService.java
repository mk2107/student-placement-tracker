package com.placementtracker.service;

import com.placementtracker.dto.StudentDTO;
import com.placementtracker.entity.Student;
import com.placementtracker.exception.DuplicateResourceException;
import com.placementtracker.exception.ResourceNotFoundException;
import com.placementtracker.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepository;

    @Transactional
    public StudentDTO createStudent(StudentDTO dto) {
        if (studentRepository.existsByRollNumber(dto.getRollNumber())) {
            throw new DuplicateResourceException("A student with roll number '" + dto.getRollNumber() + "' already exists");
        }
        if (studentRepository.existsByEmail(dto.getEmail())) {
            throw new DuplicateResourceException("A student with email '" + dto.getEmail() + "' already exists");
        }

        Student student = toEntity(dto);
        Student saved = studentRepository.save(student);
        return toDto(saved);
    }

    @Transactional(readOnly = true)
    public StudentDTO getStudentById(Long id) {
        return toDto(findStudentOrThrow(id));
    }

    @Transactional(readOnly = true)
    public Page<StudentDTO> searchStudents(String keyword, String branch, BigDecimal minCgpa, Pageable pageable) {
        return studentRepository.searchAndFilter(keyword, branch, minCgpa, pageable)
                .map(this::toDto);
    }

    @Transactional(readOnly = true)
    public List<String> getDistinctBranches() {
        return studentRepository.findDistinctBranches();
    }

    @Transactional
    public StudentDTO updateStudent(Long id, StudentDTO dto) {
        Student existing = findStudentOrThrow(id);

        // If the roll number or email is being changed, make sure it doesn't collide with ANOTHER student.
        studentRepository.findByRollNumber(dto.getRollNumber()).ifPresent(other -> {
            if (!other.getId().equals(id)) {
                throw new DuplicateResourceException("Roll number '" + dto.getRollNumber() + "' is already used by another student");
            }
        });

        existing.setName(dto.getName());
        existing.setRollNumber(dto.getRollNumber());
        existing.setEmail(dto.getEmail());
        existing.setBranch(dto.getBranch());
        existing.setCgpa(dto.getCgpa());
        existing.setSkills(dto.getSkills());
        existing.setPhoneNumber(dto.getPhoneNumber());

        return toDto(studentRepository.save(existing));
    }

    @Transactional
    public void deleteStudent(Long id) {
        Student student = findStudentOrThrow(id);
        studentRepository.delete(student); // cascades to delete this student's applications too
    }

    private Student findStudentOrThrow(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
    }

    private StudentDTO toDto(Student s) {
        StudentDTO dto = new StudentDTO();
        dto.setId(s.getId());
        dto.setName(s.getName());
        dto.setRollNumber(s.getRollNumber());
        dto.setEmail(s.getEmail());
        dto.setBranch(s.getBranch());
        dto.setCgpa(s.getCgpa());
        dto.setSkills(s.getSkills());
        dto.setPhoneNumber(s.getPhoneNumber());
        return dto;
    }

    private Student toEntity(StudentDTO dto) {
        Student s = new Student();
        s.setName(dto.getName());
        s.setRollNumber(dto.getRollNumber());
        s.setEmail(dto.getEmail());
        s.setBranch(dto.getBranch());
        s.setCgpa(dto.getCgpa());
        s.setSkills(dto.getSkills());
        s.setPhoneNumber(dto.getPhoneNumber());
        return s;
    }
}
