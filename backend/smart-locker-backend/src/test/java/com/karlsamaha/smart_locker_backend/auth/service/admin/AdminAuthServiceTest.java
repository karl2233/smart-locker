package com.karlsamaha.smart_locker_backend.auth.service.admin;

import com.karlsamaha.smart_locker_backend.auth.dto.admin.requests.AdminSigninRequest;
import com.karlsamaha.smart_locker_backend.auth.dto.admin.requests.AdminSignupRequest;
import com.karlsamaha.smart_locker_backend.auth.dto.admin.response.AdminAuthResponse;
import com.karlsamaha.smart_locker_backend.auth.entity.Role;
import com.karlsamaha.smart_locker_backend.auth.entity.User;
import com.karlsamaha.smart_locker_backend.auth.exception.InvalidCredentialsException;
import com.karlsamaha.smart_locker_backend.auth.exception.SignupException;
import com.karlsamaha.smart_locker_backend.auth.repository.RoleRepository;
import com.karlsamaha.smart_locker_backend.auth.repository.UserRepository;
import com.karlsamaha.smart_locker_backend.security.jwt.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
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
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AdminAuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;


    @Captor
    private ArgumentCaptor<User> userCaptor;

    @Captor
    private ArgumentCaptor<UserDetails> userDetailsCaptor;

    private AdminAuthService adminAuthService;

    private AdminSignupRequest signupRequest;
    private AdminSigninRequest signinRequest;

    @BeforeEach
    void setUp() {
        adminAuthService = new AdminAuthService(
                userRepository,
                roleRepository,
                passwordEncoder,
                jwtService
        );

        signupRequest = new AdminSignupRequest();
        signupRequest.setName("Karl");
        signupRequest.setEmail("admin@test.com");
        signupRequest.setPassword("plain-password");

        signinRequest = new AdminSigninRequest();
        signinRequest.setEmail("admin@test.com");
        signinRequest.setPassword("plain-password");
    }

    // ---------- signup ----------

    @Test
    void signup_emailAlreadyExists_throwsSignupException() {

        when(userRepository.existsByEmail("admin@test.com")).thenReturn(true);

        SignupException exception = assertThrows(
                SignupException.class,
                () -> adminAuthService.signup(signupRequest)
        );

        assertEquals("Email already exists", exception.getMessage());

        verify(userRepository, never()).save(any());
        verifyNoInteractions(roleRepository, passwordEncoder, jwtService);
    }

    @Test
    void signup_adminRoleNotFound_throwsSignupException() {

        when(userRepository.existsByEmail("admin@test.com")).thenReturn(false);
        when(roleRepository.findByRoleName("ROLE_ADMIN")).thenReturn(Optional.empty());

        SignupException exception = assertThrows(
                SignupException.class,
                () -> adminAuthService.signup(signupRequest)
        );

        assertEquals("Role not found: ROLE_ADMIN", exception.getMessage());

        verify(userRepository, never()).save(any());
        verifyNoInteractions(passwordEncoder, jwtService);
    }

    @Test
    void signup_validRequest_savesUserAndReturnsToken() {

        Role adminRole = new Role();
        adminRole.setRoleName("ROLE_ADMIN");

        User savedUser = new User();
        savedUser.setName("Karl");
        savedUser.setEmail("admin@test.com");
        savedUser.setPassword("encoded-password");
        savedUser.setRole(adminRole);

        when(userRepository.existsByEmail("admin@test.com")).thenReturn(false);
        when(roleRepository.findByRoleName("ROLE_ADMIN")).thenReturn(Optional.of(adminRole));
        when(passwordEncoder.encode("plain-password")).thenReturn("encoded-password");
        when(userRepository.save(any(User.class))).thenReturn(savedUser);
        when(jwtService.generateToken(any(UserDetails.class), eq("ROLE_ADMIN")))
                .thenReturn("jwt-token");

        AdminAuthResponse response = adminAuthService.signup(signupRequest);

        assertEquals("jwt-token", response.getToken());

        verify(userRepository).save(userCaptor.capture());
        User persisted = userCaptor.getValue();
        assertEquals("encoded-password", persisted.getPassword());
        assertEquals(adminRole, persisted.getRole());

        verify(jwtService).generateToken(userDetailsCaptor.capture(), eq("ROLE_ADMIN"));
        assertEquals("admin@test.com", userDetailsCaptor.getValue().getUsername());
    }

    // ---------- signin ----------

    @Test
    void signin_emailNotFound_throwsInvalidCredentialsException() {

        when(userRepository.findByEmail("admin@test.com")).thenReturn(Optional.empty());

        InvalidCredentialsException exception = assertThrows(
                InvalidCredentialsException.class,
                () -> adminAuthService.signin(signinRequest)
        );

        assertEquals("Invalid email or password", exception.getMessage());

        verifyNoInteractions(passwordEncoder, jwtService);
    }

    @Test
    void signin_passwordDoesNotMatch_throwsInvalidCredentialsException() {

        Role adminRole = new Role();
        adminRole.setRoleName("ROLE_ADMIN");

        User user = new User();
        user.setEmail("admin@test.com");
        user.setPassword("encoded-password");
        user.setRole(adminRole);

        when(userRepository.findByEmail("admin@test.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("plain-password", "encoded-password")).thenReturn(false);

        InvalidCredentialsException exception = assertThrows(
                InvalidCredentialsException.class,
                () -> adminAuthService.signin(signinRequest)
        );

        assertEquals("Invalid email or password", exception.getMessage());

        verifyNoInteractions(jwtService);
    }

    @Test
    void signin_roleIsNotAdmin_throwsInvalidCredentialsException() {

        Role userRole = new Role();
        userRole.setRoleName("ROLE_USER");

        User user = new User();
        user.setEmail("admin@test.com");
        user.setPassword("encoded-password");
        user.setRole(userRole);

        when(userRepository.findByEmail("admin@test.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("plain-password", "encoded-password")).thenReturn(true);

        InvalidCredentialsException exception = assertThrows(
                InvalidCredentialsException.class,
                () -> adminAuthService.signin(signinRequest)
        );

        assertEquals("Access denied: only admin can sign in", exception.getMessage());

        verifyNoInteractions(jwtService);
    }

    @Test
    void signin_validAdminCredentials_returnsToken() {

        Role adminRole = new Role();
        adminRole.setRoleName("ROLE_ADMIN");

        User user = new User();
        user.setEmail("admin@test.com");
        user.setPassword("encoded-password");
        user.setRole(adminRole);

        when(userRepository.findByEmail("admin@test.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("plain-password", "encoded-password")).thenReturn(true);
        when(jwtService.generateToken(any(UserDetails.class), eq("ROLE_ADMIN")))
                .thenReturn("jwt-token");

        AdminAuthResponse response = adminAuthService.signin(signinRequest);

        assertEquals("jwt-token", response.getToken());

        verify(jwtService).generateToken(userDetailsCaptor.capture(), eq("ROLE_ADMIN"));
        assertEquals("admin@test.com", userDetailsCaptor.getValue().getUsername());

        verify(userRepository, never()).save(any());
    }
}