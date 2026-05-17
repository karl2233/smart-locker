package com.karlsamaha.smart_locker_backend.category.service;


import com.karlsamaha.smart_locker_backend.category.dto.req.CategoriesSelectedRequestDto;
import com.karlsamaha.smart_locker_backend.category.dto.req.CategoryRequestDto;
import com.karlsamaha.smart_locker_backend.category.dto.resp.CategoryManagementResponseDto;
import com.karlsamaha.smart_locker_backend.category.dto.resp.CategoryResponseDto;
import com.karlsamaha.smart_locker_backend.category.dto.resp.CategorySelectedResponseDto;
import com.karlsamaha.smart_locker_backend.category.entity.Category;
import com.karlsamaha.smart_locker_backend.category.entity.CategorySelected;
import com.karlsamaha.smart_locker_backend.category.repository.CategoryRepository;
import com.karlsamaha.smart_locker_backend.category.repository.CategorySelectedRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final CategorySelectedRepository categorySelectedRepository;

    public CategoryServiceImpl(CategoryRepository categoryRepository, CategorySelectedRepository CategorySelectedRepository, CategorySelectedRepository categorySelectedRepository) {
        this.categoryRepository = categoryRepository;
        this.categorySelectedRepository = categorySelectedRepository;
    }

    @Override
    public CategoryResponseDto createCategory(CategoryRequestDto categoryRequestDto) {

        Category category = new Category();
        BeanUtils.copyProperties(categoryRequestDto, category);

        // 🔥 This returns the saved entity (with ID)
        Category savedCategory = categoryRepository.save(category);

        // map to DTO
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

        return new CategoryManagementResponseDto(
                categories,
                categoriesSelected
        );
    }

    @Override
    public List<CategoryResponseDto> selectCategories(CategoriesSelectedRequestDto requestDto) {

        List<Long> requestedIds = requestDto.getCategoryIds();

        if (requestedIds != null && !requestedIds.isEmpty()) {

            // remove duplicates from request
            requestedIds = requestedIds.stream().distinct().toList();

            // get existing ones
            List<CategorySelected> existing =
                    categorySelectedRepository.findByCategory_CategoryIdIn(requestedIds);

            List<Long> existingIds = existing.stream()
                    .map(cs -> cs.getCategory().getCategoryId())
                    .toList();

            // filter new ones
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

        // 🔥 ALWAYS return ALL selected categories
        List<CategorySelected> allSelected = categorySelectedRepository.findAll();

        return allSelected.stream()
                .map(cs -> new CategoryResponseDto(
                        cs.getCategory().getCategoryId(),
                        cs.getCategory().getCategoryName()
                ))
                .toList();
    }
}
