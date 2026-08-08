package com.karlsamaha.smart_locker_backend.menu.service;

import com.karlsamaha.smart_locker_backend.category.entity.CategorySelected;
import com.karlsamaha.smart_locker_backend.category.repository.CategorySelectedRepository;
import com.karlsamaha.smart_locker_backend.common.service.FileStorageService;
import com.karlsamaha.smart_locker_backend.menu.dto.request.CreateItemRequestDto;
import com.karlsamaha.smart_locker_backend.menu.dto.response.ItemResponseDto;
import com.karlsamaha.smart_locker_backend.menu.entity.Item;
import com.karlsamaha.smart_locker_backend.menu.exception.FileStorageException;
import com.karlsamaha.smart_locker_backend.menu.exception.ItemCreationFailedException;
import com.karlsamaha.smart_locker_backend.menu.repository.ItemRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.util.ReflectionTestUtils;

import java.math.BigDecimal;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.assertj.core.api.AssertionsForClassTypes.catchThrowableOfType;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;

@ExtendWith(MockitoExtension.class)
public class AdminMenuServiceImplTest {
    @Mock
    private CategorySelectedRepository categorySelectedRepository;
    @Mock private ItemRepository itemRepository;
    @Mock private FileStorageService fileStorageService;

    @InjectMocks
    private AdminMenuServiceImpl adminMenuService;

    private static final String STORAGE_PATH = "uploads/menu/items";
    private static final String URL_PATH = "/uploads/menu/items";

    private CreateItemRequestDto request() {
        CreateItemRequestDto dto = new CreateItemRequestDto();
        dto.setCategorySelectedId(1L);
        dto.setItemTitle("Espresso");
        dto.setItemDesc("Double shot");
        dto.setPrice(new BigDecimal("3.50"));
        dto.setImage(new MockMultipartFile(
                "image", "photo.jpg", "image/jpeg", "bytes".getBytes()));
        return dto;
    }

    private CategorySelected categorySelected() {
        CategorySelected cs = new CategorySelected();
        cs.setCategorySelectedId(1L);
        return cs;
    }

    @Test
    void createItem_whenStorageFails_throwsItemCreationFailedAndNeverSaves() {
        given(categorySelectedRepository.findById(1L))
                .willReturn(Optional.of(categorySelected()));
        given(fileStorageService.storeFile(any(), eq(STORAGE_PATH), eq(URL_PATH)))
                .willThrow(new FileStorageException("Could not store file"));

        assertThatThrownBy(() -> adminMenuService.createItem(request()))
                .isInstanceOf(ItemCreationFailedException.class)
                .hasCauseInstanceOf(FileStorageException.class);

        verifyNoInteractions(itemRepository);
        verify(fileStorageService, never()).deleteFile(any(), any());
    }

    @Test
    void createItem_whenSaveFails_deletesFileAndThrowsItemCreationFailed() {
        given(categorySelectedRepository.findById(1L))
                .willReturn(Optional.of(categorySelected()));
        given(fileStorageService.storeFile(any(), eq(STORAGE_PATH), eq(URL_PATH)))
                .willReturn(URL_PATH + "/abc.jpg");
        given(itemRepository.saveAndFlush(any(Item.class)))
                .willThrow(new DataIntegrityViolationException("constraint"));

        assertThatThrownBy(() -> adminMenuService.createItem(request()))
                .isInstanceOf(ItemCreationFailedException.class)
                .hasCauseInstanceOf(DataAccessException.class);

        verify(fileStorageService).deleteFile(STORAGE_PATH, URL_PATH + "/abc.jpg");
    }

    @Test
    void createItem_whenValid_savesItemAndReturnsResponse() {
        CreateItemRequestDto request = new CreateItemRequestDto();
        request.setCategorySelectedId(1L);
        request.setItemTitle("Espresso");
        request.setItemDesc("Double shot");
        request.setPrice(new BigDecimal("3.50"));
        request.setImage(new MockMultipartFile(
                "image", "photo.jpg", "image/jpeg", "bytes".getBytes()));

        CategorySelected categorySelected = new CategorySelected();
        categorySelected.setCategorySelectedId(1L);

        given(categorySelectedRepository.findById(1L))
                .willReturn(Optional.of(categorySelected));

        given(fileStorageService.storeFile(any(), eq(STORAGE_PATH), eq(URL_PATH)))
                .willReturn(URL_PATH + "/abc.jpg");

        given(itemRepository.saveAndFlush(any(Item.class)))
                .willAnswer(inv -> {
                    Item saved = inv.getArgument(0);
                    saved.setItemId(99L);
                    return saved;
                });

        ItemResponseDto response = adminMenuService.createItem(request);

        assertThat(response.getItemId()).isEqualTo(99L);
        assertThat(response.getCategorySelectedId()).isEqualTo(1L);
        assertThat(response.getItemTitle()).isEqualTo("Espresso");
        assertThat(response.getItemDesc()).isEqualTo("Double shot");
        assertThat(response.getItemImageUrl()).isEqualTo(URL_PATH + "/abc.jpg");
        assertThat(response.getPrice()).isEqualByComparingTo("3.50");

        verify(fileStorageService, never()).deleteFile(any(), any());
    }
}
