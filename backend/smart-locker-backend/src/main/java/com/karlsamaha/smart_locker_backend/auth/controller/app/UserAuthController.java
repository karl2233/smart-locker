package com.karlsamaha.smart_locker_backend.auth.controller.app;

import com.karlsamaha.smart_locker_backend.auth.dto.app.requests.UserSigninRequestDto;
import com.karlsamaha.smart_locker_backend.auth.dto.app.requests.UserSignupRequestDto;
import com.karlsamaha.smart_locker_backend.auth.dto.app.response.UserAuthResponse;
import com.karlsamaha.smart_locker_backend.auth.service.app.UserAuthService;
import com.karlsamaha.smart_locker_backend.common.response.SuccessResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
@RequestMapping("user/api/auth")
public class UserAuthController {
    private final UserAuthService userAuthService;

    public UserAuthController(UserAuthService userAuthService) {
        this.userAuthService = userAuthService;
    }

    @PostMapping("/signup")
    public ResponseEntity<SuccessResponse<Void>> signup(
            @Valid @RequestBody UserSignupRequestDto request
    ) {
        userAuthService.signup(request);

        SuccessResponse<Void> response = new SuccessResponse<>(LocalDateTime.now(), "Signup successful", null);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/signin")
    public ResponseEntity<SuccessResponse<UserAuthResponse>> signin(
            @Valid @RequestBody UserSigninRequestDto request
    ) {
        UserAuthResponse authResponse = userAuthService.signin(request);

        SuccessResponse<UserAuthResponse> response = new SuccessResponse<>(LocalDateTime.now(), "Signin successful", authResponse);

        return ResponseEntity.ok(response);
    }
}