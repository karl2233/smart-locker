package com.karlsamaha.smart_locker_backend.menu.service;

import com.karlsamaha.smart_locker_backend.menu.dto.request.CreateItemRequestDto;
import com.karlsamaha.smart_locker_backend.menu.dto.response.CategorySelectedResponseDto;
import com.karlsamaha.smart_locker_backend.menu.dto.response.ItemResponseDto;

import java.util.List;

public interface AdminMenuService {
    List<CategorySelectedResponseDto> getSelectedCategories();
    void createItem(CreateItemRequestDto request);
    List<ItemResponseDto> getItemsByCategorySelectedId(Long categorySelectedId);
}