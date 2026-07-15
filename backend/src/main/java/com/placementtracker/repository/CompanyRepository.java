package com.placementtracker.repository;

import com.placementtracker.entity.Company;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CompanyRepository extends JpaRepository<Company, Long> {

    @Query("""
        SELECT c FROM Company c
        WHERE (:keyword IS NULL OR :keyword = ''
               OR LOWER(c.companyName) LIKE LOWER(CONCAT('%', :keyword, '%'))
               OR LOWER(c.location) LIKE LOWER(CONCAT('%', :keyword, '%')))
        """)
    Page<Company> search(@Param("keyword") String keyword, Pageable pageable);
}
