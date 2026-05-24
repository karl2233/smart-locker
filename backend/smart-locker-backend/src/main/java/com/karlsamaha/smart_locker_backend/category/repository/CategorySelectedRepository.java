package com.karlsamaha.smart_locker_backend.category.repository;

import com.karlsamaha.smart_locker_backend.category.entity.CategorySelected;
import com.karlsamaha.smart_locker_backend.menu.dto.response.CategorySelectedResponseDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface CategorySelectedRepository extends JpaRepository<CategorySelected, Long> {
    List<CategorySelected> findByCategory_CategoryIdIn(List<Long> categoryIds);
    @Query("""
    SELECT new com.karlsamaha.smart_locker_backend.menu.dto.response.CategorySelectedResponseDto(
        cs.categorySelectedId,
        c.categoryName
    )
    FROM CategorySelected cs
    JOIN cs.category c
""")
    List<CategorySelectedResponseDto> findSelectedCategoriesWithName();
    boolean existsByCategory_CategoryId(Long categoryId);
}