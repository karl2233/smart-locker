package com.karlsamaha.smart_locker_backend.menu.dto.response;

import java.util.List;

public class CategoryItemsResponseDto {

    private String categoryName;
    private Long categorySelectedId;
    private List<MenuItemResponseDto> items;

    public CategoryItemsResponseDto(
            String categoryName,
            Long categorySelectedId,
            List<MenuItemResponseDto> items
    ) {
        this.categoryName = categoryName;
        this.categorySelectedId = categorySelectedId;
        this.items = items;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public Long getCategorySelectedId() {
        return categorySelectedId;
    }

    public List<MenuItemResponseDto> getItems() {
        return items;
    }
}
