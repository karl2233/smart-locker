package com.karlsamaha.smart_locker_backend.menu.dto.response;

import java.util.List;

public class MenuItemsResponseDto {

    private List<CategoryItemsResponseDto> categories;

    public MenuItemsResponseDto(List<CategoryItemsResponseDto> categories) {
        this.categories = categories;
    }

    public List<CategoryItemsResponseDto> getCategories() {
        return categories;
    }

    public void setCategories(List<CategoryItemsResponseDto> categories) {
        this.categories = categories;
    }
}
