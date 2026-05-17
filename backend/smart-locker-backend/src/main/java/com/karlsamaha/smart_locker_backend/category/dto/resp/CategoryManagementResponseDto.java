package com.karlsamaha.smart_locker_backend.category.dto.resp;

import java.util.List;

public class CategoryManagementResponseDto {

    private List<CategoryResponseDto> categories;
    private List<CategorySelectedResponseDto> categoriesSelected;

    public CategoryManagementResponseDto(
            List<CategoryResponseDto> categories,
            List<CategorySelectedResponseDto> categoriesSelected
    ) {
        this.categories = categories;
        this.categoriesSelected = categoriesSelected;
    }

    public List<CategoryResponseDto> getCategories() {
        return categories;
    }

    public void setCategories(List<CategoryResponseDto> categories) {
        this.categories = categories;
    }

    public List<CategorySelectedResponseDto> getCategoriesSelected() {
        return categoriesSelected;
    }

    public void setCategoriesSelected(List<CategorySelectedResponseDto> categoriesSelected) {
        this.categoriesSelected = categoriesSelected;
    }
}