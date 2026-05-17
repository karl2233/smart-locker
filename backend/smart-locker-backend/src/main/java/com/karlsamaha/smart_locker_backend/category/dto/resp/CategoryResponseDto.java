package com.karlsamaha.smart_locker_backend.category.dto.resp;

public class CategoryResponseDto {

    private Long categoryId;
    private String categoryName;

    public CategoryResponseDto() {
    }

    public CategoryResponseDto(Long categoryId, String categoryName) {
        this.categoryId = categoryId;
        this.categoryName = categoryName;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }
}
