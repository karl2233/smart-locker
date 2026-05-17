package com.karlsamaha.smart_locker_backend.menu.dto.response;

public class CategorySelectedResponseDto {

    private Long categorySelectedId;
    private String categoryName;

    public CategorySelectedResponseDto(Long categorySelectedId, String categoryName) {
        this.categorySelectedId = categorySelectedId;
        this.categoryName = categoryName;
    }

    public Long getCategorySelectedId() {
        return categorySelectedId;
    }

    public void setCategorySelectedId(Long categorySelectedId) {
        this.categorySelectedId = categorySelectedId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }
}
