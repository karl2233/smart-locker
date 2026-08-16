package com.karlsamaha.smart_locker_backend.security.config;

import com.karlsamaha.smart_locker_backend.category.dto.resp.CategoryManagementResponseDto;
import com.karlsamaha.smart_locker_backend.category.service.CategoryService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class SecurityConfigTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private CategoryService categoryService;

    @Test
    void adminApi_returnsUnauthorized_whenNoAuthentication() throws Exception {
        mockMvc.perform(get("/admin/api/category"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(authorities = "ROLE_USER")
    void adminApi_returnsForbidden_whenAuthorityIsNotAdmin() throws Exception {
        mockMvc.perform(get("/admin/api/category"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(authorities = "ROLE_ADMIN")
    void adminApi_returnsOk_whenAuthorityIsAdmin() throws Exception {
        given(categoryService.getCategoryManagementData())
                .willReturn(new CategoryManagementResponseDto(List.of(), List.of()));

        mockMvc.perform(get("/admin/api/category"))
                .andExpect(status().isOk());
    }
}