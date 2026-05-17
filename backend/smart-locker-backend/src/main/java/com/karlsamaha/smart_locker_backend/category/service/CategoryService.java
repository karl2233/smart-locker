package com.karlsamaha.smart_locker_backend.category.service;

import com.karlsamaha.smart_locker_backend.category.dto.req.CategoriesSelectedRequestDto;
import com.karlsamaha.smart_locker_backend.category.dto.req.CategoryRequestDto;
import com.karlsamaha.smart_locker_backend.category.dto.resp.CategoryManagementResponseDto;
import com.karlsamaha.smart_locker_backend.category.dto.resp.CategoryResponseDto;
import com.karlsamaha.smart_locker_backend.category.entity.Category;

import java.util.List;

public interface CategoryService {
    CategoryResponseDto createCategory(CategoryRequestDto categoryRequestDto);
    CategoryManagementResponseDto getCategoryManagementData();
    List<CategoryResponseDto> selectCategories(CategoriesSelectedRequestDto requestDto);
}
