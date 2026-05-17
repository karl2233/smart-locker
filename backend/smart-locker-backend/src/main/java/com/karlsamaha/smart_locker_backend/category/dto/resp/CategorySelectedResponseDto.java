package com.karlsamaha.smart_locker_backend.category.dto.resp;

public class CategorySelectedResponseDto {

    private Long categorySelectedId;
    private Long categoryId;
    private String categoryName;

    public CategorySelectedResponseDto(
            Long categorySelectedId,
            Long categoryId,
            String categoryName
    ) {
        this.categorySelectedId = categorySelectedId;
        this.categoryId = categoryId;
        this.categoryName = categoryName;
    }

    public Long getCategorySelectedId() {
        return categorySelectedId;
    }

    public void setCategorySelectedId(Long categorySelectedId) {
        this.categorySelectedId = categorySelectedId;
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