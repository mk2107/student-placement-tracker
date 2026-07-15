package com.placementtracker.repository;

import com.placementtracker.entity.Application;
import com.placementtracker.entity.ApplicationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ApplicationRepository extends JpaRepository<Application, Long> {

    boolean existsByStudentIdAndCompanyId(Long studentId, Long companyId);

    long countByStatus(ApplicationStatus status);

    List<Application> findByStudentId(Long studentId);

    List<Application> findByCompanyId(Long companyId);

    // Filtered, paginated list for the Applications management screen.
    @Query("""
        SELECT a FROM Application a
        WHERE (:status IS NULL OR a.status = :status)
          AND (:studentId IS NULL OR a.student.id = :studentId)
          AND (:companyId IS NULL OR a.company.id = :companyId)
        """)
    Page<Application> searchAndFilter(
            @Param("status") ApplicationStatus status,
            @Param("studentId") Long studentId,
            @Param("companyId") Long companyId,
            Pageable pageable
    );

    // A student is only counted as "placed" once, even if they applied to
    // multiple companies and got selected at more than one - hence DISTINCT.
    @Query("SELECT COUNT(DISTINCT a.student.id) FROM Application a WHERE a.status = 'SELECTED'")
    long countDistinctSelectedStudents();

    // Report: for each branch, how many distinct students were selected.
    // Returns rows of [branch, selectedCount].
    @Query("""
        SELECT a.student.branch, COUNT(DISTINCT a.student.id)
        FROM Application a
        WHERE a.status = 'SELECTED'
        GROUP BY a.student.branch
        """)
    List<Object[]> countSelectedStudentsGroupedByBranch();

    // Report: for each company, how many students were selected.
    @Query("""
        SELECT a.company.companyName, COUNT(a)
        FROM Application a
        WHERE a.status = 'SELECTED'
        GROUP BY a.company.companyName
        """)
    List<Object[]> countSelectedGroupedByCompany();

    // Company-wise selected students report - full application rows for one company.
    @Query("SELECT a FROM Application a WHERE a.company.id = :companyId AND a.status = 'SELECTED'")
    List<Application> findSelectedByCompanyId(@Param("companyId") Long companyId);
}
