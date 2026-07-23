package com.karlsamaha.smart_locker_backend.category.dto.req;

import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public class CategoriesSelectedRequestDto {

    @NotEmpty(message = "At least one category id must be provided")
    private List<Long> categoryIds;

    public CategoriesSelectedRequestDto() {
    }

    public CategoriesSelectedRequestDto(List<Long> categoryIds) {
        this.categoryIds = categoryIds;
    }

    public List<Long> getCategoryIds() {
        return categoryIds;
    }

    public void setCategoryIds(List<Long> categoryIds) {
        this.categoryIds = categoryIds;
    }
}