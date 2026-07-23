package com.karlsamaha.smart_locker_backend.menu.controller;

import com.karlsamaha.smart_locker_backend.common.response.ListSuccessResponse;
import com.karlsamaha.smart_locker_backend.common.response.SuccessResponse;
import com.karlsamaha.smart_locker_backend.menu.dto.request.CreateItemRequestDto;
import com.karlsamaha.smart_locker_backend.menu.dto.response.CategorySelectedResponseDto;
import com.karlsamaha.smart_locker_backend.menu.dto.response.ItemResponseDto;
import com.karlsamaha.smart_locker_backend.menu.service.AdminMenuService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("admin/api/menu")
public class AdminMenuController {

    private final AdminMenuService adminMenuService;

    public AdminMenuController(AdminMenuService adminMenuService) {
        this.adminMenuService = adminMenuService;
    }

    @GetMapping("/selected-categories")
    public ResponseEntity<ListSuccessResponse<CategorySelectedResponseDto>> getSelectedCategories() {
        List<CategorySelectedResponseDto> categories = adminMenuService.getSelectedCategories();

        ListSuccessResponse<CategorySelectedResponseDto> response =
                new ListSuccessResponse<>(LocalDateTime.now(), "Selected categories fetched successfully", categories);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/create-items")
    public ResponseEntity<SuccessResponse<ItemResponseDto>> createItem(
            @Valid @ModelAttribute CreateItemRequestDto request
    ) {
        ItemResponseDto item = adminMenuService.createItem(request);

        SuccessResponse<ItemResponseDto> response =
                new SuccessResponse<>(LocalDateTime.now(), "Item created successfully", item);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/items/{categorySelectedId}")
    public ResponseEntity<ListSuccessResponse<ItemResponseDto>> getItemsByCategorySelectedId(
            @PathVariable Long categorySelectedId
    ) {
        List<ItemResponseDto> items = adminMenuService.getItemsByCategorySelectedId(categorySelectedId);

        ListSuccessResponse<ItemResponseDto> response =
                new ListSuccessResponse<>(LocalDateTime.now(), "Items fetched successfully", items);

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<SuccessResponse<Long>> deleteItem(
            @PathVariable Long itemId
    ) {
        Long deletedItemId = adminMenuService.deleteItem(itemId);

        SuccessResponse<Long> response =
                new SuccessResponse<>(LocalDateTime.now(), "Item deleted successfully", deletedItemId);

        return ResponseEntity.ok(response);
    }
}