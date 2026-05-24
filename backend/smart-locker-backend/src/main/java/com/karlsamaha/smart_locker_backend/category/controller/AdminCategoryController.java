package com.karlsamaha.smart_locker_backend.category.controller;

import com.karlsamaha.smart_locker_backend.category.dto.req.CategoriesSelectedRequestDto;
import com.karlsamaha.smart_locker_backend.category.dto.req.CategoryRequestDto;
import com.karlsamaha.smart_locker_backend.category.dto.resp.CategoryManagementResponseDto;
import com.karlsamaha.smart_locker_backend.category.dto.resp.CategoryResponseDto;
import com.karlsamaha.smart_locker_backend.category.entity.Category;
import com.karlsamaha.smart_locker_backend.category.service.CategoryService;
import com.karlsamaha.smart_locker_backend.common.response.ListSuccessResponse;
import com.karlsamaha.smart_locker_backend.common.response.SuccessResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("admin/api/category")
public class AdminCategoryController {
    private final CategoryService categoryService;

    public AdminCategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @PostMapping
    public ResponseEntity<SuccessResponse<CategoryResponseDto>> createCategory(
            @RequestBody CategoryRequestDto categoryRequestDto
    ) {

        CategoryResponseDto category = categoryService.createCategory(categoryRequestDto);

        SuccessResponse<CategoryResponseDto> response =
                new SuccessResponse<>(
                        LocalDateTime.now(),
                        "Category created successfully",
                        category
                );

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<SuccessResponse<CategoryManagementResponseDto>> getAllCategories() {

        CategoryManagementResponseDto data = categoryService.getCategoryManagementData();

        SuccessResponse<CategoryManagementResponseDto> response =
                new SuccessResponse<>(
                        LocalDateTime.now(),
                        "Category management data fetched successfully",
                        data
                );

        return ResponseEntity.ok(response);
    }

    @PutMapping("/selected")
    public ResponseEntity<ListSuccessResponse<CategoryResponseDto>> selectCategories(
            @RequestBody CategoriesSelectedRequestDto requestDto
    ) {

        List<CategoryResponseDto> categories =
                categoryService.selectCategories(requestDto);

        ListSuccessResponse<CategoryResponseDto> response =
                new ListSuccessResponse<>(
                        LocalDateTime.now(),
                        "Categories selected successfully",
                        categories
                );

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/selected-categories/{categorySelectedId}")
    public ResponseEntity<SuccessResponse<Void>> deleteSelectedCategory(
            @PathVariable Long categorySelectedId
    ) {

        categoryService.deleteSelectedCategory(categorySelectedId);

        SuccessResponse<Void> response =
                new SuccessResponse<>(
                        LocalDateTime.now(),
                        "Selected category deleted successfully",
                        null
                );

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{categoryId}")
    public ResponseEntity<SuccessResponse<Void>> deleteCategory(
            @PathVariable Long categoryId
    ) {
        categoryService.deleteCategory(categoryId);

        SuccessResponse<Void> response =
                new SuccessResponse<>(
                        LocalDateTime.now(),
                        "Category deleted successfully",
                        null
                );

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{categoryId}")
    public ResponseEntity<SuccessResponse<String>> updateCategory(
            @PathVariable Long categoryId,
            @RequestParam String categoryName
    ) {

        String message = categoryService.updateCategory(
                categoryId,
                categoryName
        );

        SuccessResponse<String> response =
                new SuccessResponse<>(
                        LocalDateTime.now(),
                        message,
                        null
                );

        return ResponseEntity.ok(response);
    }
}
