package com.placementtracker.controller;

import com.placementtracker.dto.ApiResponse;
import com.placementtracker.dto.StudentDTO;
import com.placementtracker.service.StudentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;

    // POST http://localhost:8080/api/students
    @PostMapping
    public ApiResponse<StudentDTO> createStudent(@Valid @RequestBody StudentDTO dto) {
        return ApiResponse.success("Student created successfully", studentService.createStudent(dto));
    }

    // GET http://localhost:8080/api/students/5
    @GetMapping("/{id}")
    public ApiResponse<StudentDTO> getStudent(@PathVariable Long id) {
        return ApiResponse.success("Student fetched successfully", studentService.getStudentById(id));
    }

    // GET http://localhost:8080/api/students?keyword=priya&branch=CSE&minCgpa=8&page=0&size=10&sortBy=name
    @GetMapping
    public ApiResponse<Page<StudentDTO>> searchStudents(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String branch,
            @RequestParam(required = false) BigDecimal minCgpa,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sortBy
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy).ascending());
        return ApiResponse.success("Students fetched successfully",
                studentService.searchStudents(keyword, branch, minCgpa, pageable));
    }

    // GET http://localhost:8080/api/students/branches - powers the branch filter dropdown
    @GetMapping("/branches")
    public ApiResponse<List<String>> getBranches() {
        return ApiResponse.success("Branches fetched successfully", studentService.getDistinctBranches());
    }

    // PUT http://localhost:8080/api/students/5
    @PutMapping("/{id}")
    public ApiResponse<StudentDTO> updateStudent(@PathVariable Long id, @Valid @RequestBody StudentDTO dto) {
        return ApiResponse.success("Student updated successfully", studentService.updateStudent(id, dto));
    }

    // DELETE http://localhost:8080/api/students/5
    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
        return ApiResponse.success("Student deleted successfully", null);
    }
}
