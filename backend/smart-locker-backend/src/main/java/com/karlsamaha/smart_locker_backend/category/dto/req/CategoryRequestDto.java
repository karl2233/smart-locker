package com.karlsamaha.smart_locker_backend.category.dto.req;

public class CategoryRequestDto {

    private String categoryName;

    public CategoryRequestDto() {
    }

    public CategoryRequestDto(String categoryName) {
        this.categoryName = categoryName;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }
}
