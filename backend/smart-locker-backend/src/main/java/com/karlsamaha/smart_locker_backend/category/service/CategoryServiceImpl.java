package com.karlsamaha.smart_locker_backend.category.service;

import com.karlsamaha.smart_locker_backend.category.dto.req.CategoriesSelectedRequestDto;
import com.karlsamaha.smart_locker_backend.category.dto.req.CategoryRequestDto;
import com.karlsamaha.smart_locker_backend.category.dto.resp.CategoryManagementResponseDto;
import com.karlsamaha.smart_locker_backend.category.dto.resp.CategoryResponseDto;
import com.karlsamaha.smart_locker_backend.category.dto.resp.CategorySelectedResponseDto;
import com.karlsamaha.smart_locker_backend.category.entity.Category;
import com.karlsamaha.smart_locker_backend.category.entity.CategorySelected;
import com.karlsamaha.smart_locker_backend.category.exception.CategoryException;
import com.karlsamaha.smart_locker_backend.category.exception.CategorySelectedException;
import com.karlsamaha.smart_locker_backend.category.repository.CategoryRepository;
import com.karlsamaha.smart_locker_backend.category.repository.CategorySelectedRepository;
import com.karlsamaha.smart_locker_backend.menu.repository.ItemRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final CategorySelectedRepository categorySelectedRepository;
    private final ItemRepository itemRepository;

    public CategoryServiceImpl(
            CategoryRepository categoryRepository,
            CategorySelectedRepository categorySelectedRepository,
            ItemRepository itemRepository
    ) {
        this.categoryRepository = categoryRepository;
        this.categorySelectedRepository = categorySelectedRepository;
        this.itemRepository = itemRepository;
    }

    @Override
    public CategoryResponseDto createCategory(CategoryRequestDto categoryRequestDto) {
        Category category = new Category();
        BeanUtils.copyProperties(categoryRequestDto, category);

        Category savedCategory = categoryRepository.save(category);

        CategoryResponseDto responseDto = new CategoryResponseDto();
        BeanUtils.copyProperties(savedCategory, responseDto);

        return responseDto;
    }

    public CategoryManagementResponseDto getCategoryManagementData() {
        List<CategoryResponseDto> categories = categoryRepository.findAll()
                .stream()
                .map(category -> new CategoryResponseDto(
                        category.getCategoryId(),
                        category.getCategoryName()
                ))
                .collect(Collectors.toList());

        List<CategorySelectedResponseDto> categoriesSelected =
                categorySelectedRepository.findAll()
                        .stream()
                        .map(selected -> new CategorySelectedResponseDto(
                                selected.getCategorySelectedId(),
                                selected.getCategory().getCategoryId(),
                                selected.getCategory().getCategoryName()
                        ))
                        .collect(Collectors.toList());

        return new CategoryManagementResponseDto(categories, categoriesSelected);
    }

    @Override
    public List<CategoryResponseDto> selectCategories(CategoriesSelectedRequestDto requestDto) {
        List<Long> requestedIds = requestDto.getCategoryIds();

        if (requestedIds != null && !requestedIds.isEmpty()) {
            requestedIds = requestedIds.stream().distinct().toList();

            List<CategorySelected> existing =
                    categorySelectedRepository.findByCategory_CategoryIdIn(requestedIds);

            List<Long> existingIds = existing.stream()
                    .map(cs -> cs.getCategory().getCategoryId())
                    .toList();

            List<Long> idsToInsert = requestedIds.stream()
                    .filter(id -> !existingIds.contains(id))
                    .toList();

            if (!idsToInsert.isEmpty()) {
                List<Category> categories = categoryRepository.findAllById(idsToInsert);

                List<CategorySelected> toSave = categories.stream()
                        .map(CategorySelected::new)
                        .toList();

                categorySelectedRepository.saveAll(toSave);
            }
        }

        List<CategorySelected> allSelected = categorySelectedRepository.findAll();

        return allSelected.stream()
                .map(cs -> new CategoryResponseDto(
                        cs.getCategory().getCategoryId(),
                        cs.getCategory().getCategoryName()
                ))
                .toList();
    }

    @Override
    public void deleteSelectedCategory(Long categorySelectedId) {
        CategorySelected categorySelected = categorySelectedRepository
                .findById(categorySelectedId)
                .orElseThrow(() -> new CategorySelectedException("Selected category not found"));

        boolean hasItems = itemRepository
                .existsByCategorySelected_CategorySelectedId(categorySelectedId);

        if (hasItems) {
            throw new CategorySelectedException("Delete items first, then delete this category");
        }

        categorySelectedRepository.delete(categorySelected);
    }

    @Override
    public void deleteCategory(Long categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new CategoryException("Category not found"));

        boolean isSelected = categorySelectedRepository
                .existsByCategory_CategoryId(categoryId);

        if (isSelected) {
            throw new CategoryException("Unselect this category first, then delete it");
        }

        categoryRepository.delete(category);
    }

    @Override
    public String updateCategory(Long categoryId, String categoryName) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new CategoryException("Category not found"));

        category.setCategoryName(categoryName);
        categoryRepository.save(category);

        return "Category updated successfully";
    }
}