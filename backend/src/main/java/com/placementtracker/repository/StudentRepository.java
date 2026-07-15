package com.placementtracker.repository;

import com.placementtracker.entity.Student;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {

    boolean existsByRollNumber(String rollNumber);

    boolean existsByEmail(String email);

    Optional<Student> findByRollNumber(String rollNumber);

    /**
     * Combined search + filter + pagination in a single query.
     * - keyword: matches against name OR roll number OR email (case-insensitive), pass null/empty to skip
     * - branch: exact match, pass null to skip
     * - minCgpa: only students with CGPA >= this value, pass null to skip
     *
     * The ":param IS NULL OR field = :param" pattern lets ONE query handle
     * "search only", "filter only", "both", or "neither" without writing four
     * separate queries.
     */
    @Query("""
        SELECT s FROM Student s
        WHERE (:keyword IS NULL OR :keyword = '' 
               OR LOWER(s.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
               OR LOWER(s.rollNumber) LIKE LOWER(CONCAT('%', :keyword, '%'))
               OR LOWER(s.email) LIKE LOWER(CONCAT('%', :keyword, '%')))
          AND (:branch IS NULL OR :branch = '' OR s.branch = :branch)
          AND (:minCgpa IS NULL OR s.cgpa >= :minCgpa)
        """)
    Page<Student> searchAndFilter(
            @Param("keyword") String keyword,
            @Param("branch") String branch,
            @Param("minCgpa") BigDecimal minCgpa,
            Pageable pageable
    );

    long countByBranch(String branch);

    @Query("SELECT DISTINCT s.branch FROM Student s ORDER BY s.branch")
    java.util.List<String> findDistinctBranches();
}
