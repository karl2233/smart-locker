package com.karlsamaha.smart_locker_backend.menu.service;

import com.karlsamaha.smart_locker_backend.category.entity.CategorySelected;
import com.karlsamaha.smart_locker_backend.category.repository.CategorySelectedRepository;
import com.karlsamaha.smart_locker_backend.common.service.FileStorageService;
import com.karlsamaha.smart_locker_backend.menu.dto.request.CreateItemRequestDto;
import com.karlsamaha.smart_locker_backend.menu.dto.response.CategorySelectedResponseDto;
import com.karlsamaha.smart_locker_backend.menu.dto.response.ItemResponseDto;
import com.karlsamaha.smart_locker_backend.menu.entity.Item;
import com.karlsamaha.smart_locker_backend.menu.exception.CategorySelectedNotFoundException;
import com.karlsamaha.smart_locker_backend.menu.repository.ItemRepository;
import org.springframework.stereotype.Service;
import com.karlsamaha.smart_locker_backend.menu.exception.ItemNotFoundException;

import java.util.List;

@Service
public class AdminMenuServiceImpl implements AdminMenuService {

    private final CategorySelectedRepository categorySelectedRepository;
    private final ItemRepository itemRepository;
    private final FileStorageService fileStorageService;

    public AdminMenuServiceImpl(
            CategorySelectedRepository categorySelectedRepository,
            ItemRepository itemRepository,
            FileStorageService fileStorageService
    ) {
        this.categorySelectedRepository = categorySelectedRepository;
        this.itemRepository = itemRepository;
        this.fileStorageService = fileStorageService;
    }

    @Override
    public List<CategorySelectedResponseDto> getSelectedCategories() {
        return categorySelectedRepository.findSelectedCategoriesWithName();
    }

    @Override
    public ItemResponseDto createItem(CreateItemRequestDto request) {

        CategorySelected categorySelected = categorySelectedRepository
                .findById(request.getCategorySelectedId())
                .orElseThrow(CategorySelectedNotFoundException::new);

        String imageUrl = fileStorageService.storeFile(
                request.getImage(),
                "uploads/menu/items",
                "/uploads/menu/items"
        );

        Item item = new Item();

        item.setCategorySelected(categorySelected);
        item.setItemTitle(request.getItemTitle());
        item.setItemDesc(request.getItemDesc());
        item.setPrice(request.getPrice());
        item.setItemImageUrl(imageUrl);

        Item savedItem = itemRepository.save(item);

        return new ItemResponseDto(
                savedItem.getItemId(),
                savedItem.getCategorySelected().getCategorySelectedId(),
                savedItem.getItemTitle(),
                savedItem.getItemDesc(),
                savedItem.getItemImageUrl(),
                savedItem.getPrice()
        );
    }

    @Override
    public List<ItemResponseDto> getItemsByCategorySelectedId(Long categorySelectedId) {
        return itemRepository.findItemsByCategorySelectedId(categorySelectedId);
    }

    @Override
    public Long deleteItem(Long itemId) {

        Item item =
                itemRepository
                        .findById(itemId)
                        .orElseThrow(ItemNotFoundException::new);

        itemRepository.delete(item);

        return itemId;
    }
}
