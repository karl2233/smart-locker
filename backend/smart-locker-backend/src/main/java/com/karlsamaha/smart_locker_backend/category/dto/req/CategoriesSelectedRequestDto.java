package com.karlsamaha.smart_locker_backend.category.dto.req;

import java.util.List;

public class CategoriesSelectedRequestDto {

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
