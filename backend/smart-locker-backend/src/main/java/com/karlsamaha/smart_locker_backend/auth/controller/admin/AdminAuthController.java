package com.karlsamaha.smart_locker_backend.auth.controller.admin;

import com.karlsamaha.smart_locker_backend.auth.dto.admin.requests.AdminSigninRequest;
import com.karlsamaha.smart_locker_backend.auth.dto.admin.requests.AdminSignupRequest;
import com.karlsamaha.smart_locker_backend.auth.dto.admin.response.AdminAuthResponse;
import com.karlsamaha.smart_locker_backend.auth.service.admin.AdminAuthService;
import com.karlsamaha.smart_locker_backend.common.response.SuccessResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("admin/api/auth")
public class AdminAuthController {

    private final AdminAuthService authService;

    public AdminAuthController(AdminAuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/signup")
    public ResponseEntity<SuccessResponse<AdminAuthResponse>> signup(
            @Valid @RequestBody AdminSignupRequest request) {

        AdminAuthResponse adminAuthResponse = authService.signup(request);

        SuccessResponse<AdminAuthResponse> response =
                new SuccessResponse<>(LocalDateTime.now(), "Admin created successfully", adminAuthResponse);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/signin")
    public ResponseEntity<SuccessResponse<AdminAuthResponse>> signin(
            @Valid @RequestBody AdminSigninRequest request) {

        AdminAuthResponse adminAuthResponse = authService.signin(request);

        SuccessResponse<AdminAuthResponse> response =
                new SuccessResponse<>(LocalDateTime.now(), "Admin signed in successfully", adminAuthResponse);

        return ResponseEntity.ok(response);
    }
}