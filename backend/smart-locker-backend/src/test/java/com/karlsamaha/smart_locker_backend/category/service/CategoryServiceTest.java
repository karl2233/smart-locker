package com.karlsamaha.smart_locker_backend.category.service;

import com.karlsamaha.smart_locker_backend.category.dto.req.CategoriesSelectedRequestDto;
import com.karlsamaha.smart_locker_backend.category.dto.req.CategoryRequestDto;
import com.karlsamaha.smart_locker_backend.category.entity.Category;
import com.karlsamaha.smart_locker_backend.category.entity.CategorySelected;
import com.karlsamaha.smart_locker_backend.category.exception.CategoryException;
import com.karlsamaha.smart_locker_backend.category.exception.CategorySelectedException;
import com.karlsamaha.smart_locker_backend.category.exception.DuplicateCategoryException;
import com.karlsamaha.smart_locker_backend.category.repository.CategoryRepository;
import com.karlsamaha.smart_locker_backend.category.repository.CategorySelectedRepository;
import com.karlsamaha.smart_locker_backend.menu.repository.ItemRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.DataIntegrityViolationException;


import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.AssertionsForClassTypes.assertThatThrownBy;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CategoryServiceTest {

    @Mock
    private CategorySelectedRepository categorySelectedRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    ItemRepository itemRepository;

    @InjectMocks
    private CategoryServiceImpl service;

    @Captor
    private ArgumentCaptor<List<CategorySelected>> savedCaptor;

    //-------createCategory()---------

    @Test
    void createCategory_translatesIntegrityViolationToDuplicate() {
        when(categoryRepository.saveAndFlush(any()))
                .thenThrow(new DataIntegrityViolationException("uk_categories_category_name"));

        assertThatThrownBy(() -> service.createCategory(new CategoryRequestDto("Electronics")))
                .isInstanceOf(DuplicateCategoryException.class)
                .hasMessageContaining("Electronics");
    }

    @Test
    void createCategory_returnsSavedIdAndName() {
        when(categoryRepository.saveAndFlush(any()))
                .thenReturn(new Category(1L, "Electronics"));

        var result = service.createCategory(new CategoryRequestDto("Electronics"));

        assertThat(result.getCategoryId()).isEqualTo(1L);
        assertThat(result.getCategoryName()).isEqualTo("Electronics");
    }

    //-------selectCategories()---------

    @Test
    @DisplayName("none already selected -> inserts every requested category")
    void insertsAllWhenNoneAlreadySelected() {
        CategoriesSelectedRequestDto request =
                new CategoriesSelectedRequestDto(List.of(5L, 7L));

        // category_selected is empty for these ids
        when(categorySelectedRepository.findByCategory_CategoryIdIn(List.of(5L, 7L)))
                .thenReturn(List.of());
        // both categories exist in the category table
        when(categoryRepository.findAllById(List.of(5L, 7L)))
                .thenReturn(List.of(new Category(5L, "cat-5"), new Category(7L, "cat-7")));

        service.selectCategories(request);

        verify(categorySelectedRepository).saveAll(savedCaptor.capture());
        assertThat(savedCategoryIds()).containsExactlyInAnyOrder(5L, 7L);
    }
    @Test
    @DisplayName("one already selected -> inserts only the new one, skips the duplicate")
    void skipsAlreadySelectedAndInsertsOnlyTheNewOne() {
        CategoriesSelectedRequestDto request =
                new CategoriesSelectedRequestDto(List.of(3L, 5L));

        // category 3 is already selected, 5 is not
        when(categorySelectedRepository.findByCategory_CategoryIdIn(List.of(3L, 5L)))
                .thenReturn(List.of(new CategorySelected(new Category(3L, "cat-3"))));
        // NOTE: [5L] and not [3L, 5L] - if the filter breaks and the service asks
        // for both, this stub will not match and the test fails. That is deliberate.
        when(categoryRepository.findAllById(List.of(5L)))
                .thenReturn(List.of(new Category(5L, "cat-5")));

        service.selectCategories(request);

        verify(categorySelectedRepository).saveAll(savedCaptor.capture());
        assertThat(savedCategoryIds()).containsExactly(5L);
    }

    @Test
    @DisplayName("everything already selected -> no write at all")
    void doesNotWriteWhenEverythingAlreadySelected() {
        CategoriesSelectedRequestDto request =
                new CategoriesSelectedRequestDto(List.of(3L));

        when(categorySelectedRepository.findByCategory_CategoryIdIn(List.of(3L)))
                .thenReturn(List.of(new CategorySelected(new Category(3L, "cat-3"))));

        service.selectCategories(request);

        // not just "saved an empty list" - saveAll must not be called at all
        verify(categorySelectedRepository, never()).saveAll(any());
        verify(categoryRepository, never()).findAllById(any());
    }

    private List<Long> savedCategoryIds() {
        return savedCaptor.getValue().stream()
                .map(cs -> cs.getCategory().getCategoryId())
                .toList();
    }

    //---------deleteCategory(Long categoryId)-----------

    @Test
    void deleteSelectedCategory_throwsWhenSelectionNotFound() {
        when(categorySelectedRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(CategorySelectedException.class,
                () -> service.deleteSelectedCategory(1L));

        verify(categorySelectedRepository, never()).delete(any());
        verifyNoInteractions(itemRepository);
    }

    @Test
    void deleteSelectedCategory_throwsWhenSelectionStillHasItems() {
        CategorySelected selected = new CategorySelected(new Category());
        when(categorySelectedRepository.findById(1L)).thenReturn(Optional.of(selected));
        when(itemRepository.existsByCategorySelected_CategorySelectedId(1L)).thenReturn(true);

        assertThrows(CategorySelectedException.class,
                () -> service.deleteSelectedCategory(1L));

        verify(categorySelectedRepository, never()).delete(any());
    }

    @Test
    void deleteSelectedCategory_deletesWhenNoItemsRemain() {
        CategorySelected selected = new CategorySelected(new Category());
        when(categorySelectedRepository.findById(1L)).thenReturn(Optional.of(selected));
        when(itemRepository.existsByCategorySelected_CategorySelectedId(1L)).thenReturn(false);

        service.deleteSelectedCategory(1L);

        verify(categorySelectedRepository).delete(selected);
    }

    //------------updateCategory(Long categoryId, String categoryName)-------------------

    @Test
    void updateCategory_throwsWhenCategoryNotFound() {
        when(categoryRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(CategoryException.class,
                () -> service.updateCategory(1L, "Drinks"));

        verify(categoryRepository, never()).save(any());
    }

    @Test
    void updateCategory_setsNameAndSavesWhenFound() {
        Category category = new Category(1L, "Drink");
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));
        when(categoryRepository.save(category)).thenReturn(category);

        service.updateCategory(1L, "Drinks");

        assertEquals("Drinks", category.getCategoryName());
        verify(categoryRepository).save(category);
    }
}
