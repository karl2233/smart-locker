package com.karlsamaha.smart_locker_backend.auth.service.app;

import com.karlsamaha.smart_locker_backend.auth.dto.app.requests.UserSigninRequestDto;
import com.karlsamaha.smart_locker_backend.auth.dto.app.requests.UserSignupRequestDto;
import com.karlsamaha.smart_locker_backend.auth.dto.app.response.UserAuthResponse;
import com.karlsamaha.smart_locker_backend.auth.entity.Role;
import com.karlsamaha.smart_locker_backend.auth.entity.User;
import com.karlsamaha.smart_locker_backend.auth.exception.SignupException;
import com.karlsamaha.smart_locker_backend.auth.exception.UserSigninException;
import com.karlsamaha.smart_locker_backend.auth.repository.RoleRepository;
import com.karlsamaha.smart_locker_backend.auth.repository.UserRepository;
import com.karlsamaha.smart_locker_backend.security.jwt.JwtService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserAuthServiceTest {

    private static final Long USER_ROLE_ID = 2L;

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private UserAuthService userAuthService;

    private Role role(String roleName) {
        Role role = new Role();
        role.setRoleName(roleName);
        return role;
    }

    private User user(String email, String encodedPassword, String roleName) {
        User user = new User();
        user.setEmail(email);
        user.setPassword(encodedPassword);
        user.setRole(role(roleName));
        return user;
    }

    private UserSignupRequestDto signupRequest(
            String name,
            String email,
            String password,
            String confirmPassword
    ) {
        UserSignupRequestDto request = new UserSignupRequestDto();
        request.setName(name);
        request.setEmail(email);
        request.setPassword(password);
        request.setConfirmPassword(confirmPassword);
        return request;
    }

    private UserSigninRequestDto signinRequest(String email, String password) {
        UserSigninRequestDto request = new UserSigninRequestDto();
        request.setEmail(email);
        request.setPassword(password);
        return request;
    }

    // ---------- signup ----------

    @Test
    void signup_nameMissing_throwsSignupException() {
        UserSignupRequestDto request =
                signupRequest("   ", "karl@mail.com", "pass123", "pass123");

        SignupException exception = assertThrows(
                SignupException.class,
                () -> userAuthService.signup(request)
        );

        assertEquals("Name is required", exception.getMessage());
        verify(userRepository, never()).save(any());
    }

    @Test
    void signup_emailMissing_throwsSignupException() {
        UserSignupRequestDto request =
                signupRequest("Karl", null, "pass123", "pass123");

        SignupException exception = assertThrows(
                SignupException.class,
                () -> userAuthService.signup(request)
        );

        assertEquals("Email is required", exception.getMessage());
        verify(userRepository, never()).save(any());
    }

    @Test
    void signup_passwordMissing_throwsSignupException() {
        UserSignupRequestDto request =
                signupRequest("Karl", "karl@mail.com", null, "pass123");

        SignupException exception = assertThrows(
                SignupException.class,
                () -> userAuthService.signup(request)
        );

        assertEquals("Password is required", exception.getMessage());
        verify(userRepository, never()).save(any());
    }

    @Test
    void signup_confirmPasswordMissing_throwsSignupException() {
        UserSignupRequestDto request =
                signupRequest("Karl", "karl@mail.com", "pass123", "");

        SignupException exception = assertThrows(
                SignupException.class,
                () -> userAuthService.signup(request)
        );

        assertEquals("Confirm password is required", exception.getMessage());
        verify(userRepository, never()).save(any());
    }

    @Test
    void signup_passwordsDoNotMatch_throwsSignupException() {
        UserSignupRequestDto request =
                signupRequest("Karl", "karl@mail.com", "pass123", "pass456");

        SignupException exception = assertThrows(
                SignupException.class,
                () -> userAuthService.signup(request)
        );

        assertEquals("Passwords do not match", exception.getMessage());
        verify(userRepository, never()).save(any());
    }

    @Test
    void signup_emailAlreadyExists_throwsSignupException() {
        UserSignupRequestDto request =
                signupRequest("Karl", "karl@mail.com", "pass123", "pass123");

        when(userRepository.existsByEmail("karl@mail.com")).thenReturn(true);

        SignupException exception = assertThrows(
                SignupException.class,
                () -> userAuthService.signup(request)
        );

        assertEquals("Email already exists", exception.getMessage());
        verify(userRepository, never()).save(any());
    }

    @Test
    void signup_roleNotFound_throwsRuntimeException() {
        UserSignupRequestDto request =
                signupRequest("Karl", "karl@mail.com", "pass123", "pass123");

        when(userRepository.existsByEmail("karl@mail.com")).thenReturn(false);
        when(roleRepository.findById(USER_ROLE_ID)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> userAuthService.signup(request)
        );

        assertEquals("ROLE_USER not found", exception.getMessage());
        verify(userRepository, never()).save(any());
    }

    @Test
    void signup_validRequest_savesUser() {
        UserSignupRequestDto request =
                signupRequest("Karl", "karl@mail.com", "pass123", "pass123");
        Role userRole = role("ROLE_USER");

        when(userRepository.existsByEmail("karl@mail.com")).thenReturn(false);
        when(roleRepository.findById(USER_ROLE_ID)).thenReturn(Optional.of(userRole));
        when(passwordEncoder.encode("pass123")).thenReturn("encoded-pass123");

        userAuthService.signup(request);

        ArgumentCaptor<User> savedUser = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(savedUser.capture());

        assertEquals("Karl", savedUser.getValue().getName());
        assertEquals("karl@mail.com", savedUser.getValue().getEmail());
        assertEquals("encoded-pass123", savedUser.getValue().getPassword());
        assertEquals(userRole, savedUser.getValue().getRole());
    }

    // ---------- signin ----------

    @Test
    void signin_emailNotFound_throwsUserSigninException() {
        UserSigninRequestDto request = signinRequest("karl@mail.com", "pass123");

        when(userRepository.findByEmail("karl@mail.com")).thenReturn(Optional.empty());

        UserSigninException exception = assertThrows(
                UserSigninException.class,
                () -> userAuthService.signin(request)
        );

        assertEquals("Invalid email or password", exception.getMessage());
    }

    @Test
    void signin_passwordDoesNotMatch_throwsUserSigninException() {
        UserSigninRequestDto request = signinRequest("karl@mail.com", "wrong-pass");
        User existingUser = user("karl@mail.com", "encoded-pass123", "ROLE_USER");

        when(userRepository.findByEmail("karl@mail.com")).thenReturn(Optional.of(existingUser));
        when(passwordEncoder.matches("wrong-pass", "encoded-pass123")).thenReturn(false);

        UserSigninException exception = assertThrows(
                UserSigninException.class,
                () -> userAuthService.signin(request)
        );

        assertEquals("Invalid email or password", exception.getMessage());
        verify(jwtService, never()).generateToken(any(), any());
    }

    @Test
    void signin_roleIsNotUser_throwsUserSigninException() {
        UserSigninRequestDto request = signinRequest("karl@mail.com", "pass123");
        User existingUser = user("karl@mail.com", "encoded-pass123", "ROLE_ADMIN");

        when(userRepository.findByEmail("karl@mail.com")).thenReturn(Optional.of(existingUser));
        when(passwordEncoder.matches("pass123", "encoded-pass123")).thenReturn(true);

        UserSigninException exception = assertThrows(
                UserSigninException.class,
                () -> userAuthService.signin(request)
        );

        assertEquals("Access denied: only user can sign in", exception.getMessage());
        verify(jwtService, never()).generateToken(any(), any());
    }

    @Test
    void signin_validCredentials_returnsToken() {
        UserSigninRequestDto request = signinRequest("karl@mail.com", "pass123");
        User existingUser = user("karl@mail.com", "encoded-pass123", "ROLE_USER");

        when(userRepository.findByEmail("karl@mail.com")).thenReturn(Optional.of(existingUser));
        when(passwordEncoder.matches("pass123", "encoded-pass123")).thenReturn(true);
        when(jwtService.generateToken(any(UserDetails.class), eq("ROLE_USER")))
                .thenReturn("jwt-token");

        UserAuthResponse response = userAuthService.signin(request);

        assertEquals("jwt-token", response.getToken());

        ArgumentCaptor<UserDetails> userDetails = ArgumentCaptor.forClass(UserDetails.class);
        verify(jwtService).generateToken(userDetails.capture(), eq("ROLE_USER"));
        assertEquals("karl@mail.com", userDetails.getValue().getUsername());
    }
}