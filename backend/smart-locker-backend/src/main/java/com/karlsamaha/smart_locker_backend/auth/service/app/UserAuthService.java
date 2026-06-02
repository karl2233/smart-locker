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
import jakarta.transaction.Transactional;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserAuthService {
    private static final Long USER_ROLE_ID = 2L;

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public UserAuthService(
            UserRepository userRepository,
            RoleRepository roleRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional
    public void signup(UserSignupRequestDto request) {

        if (request.getName() == null || request.getName().isBlank()) {
            throw new SignupException("Name is required");
        }

        if (request.getEmail() == null || request.getEmail().isBlank()) {
            throw new SignupException("Email is required");
        }

        if (request.getPassword() == null || request.getPassword().isBlank()) {
            throw new SignupException("Password is required");
        }

        if (request.getConfirmPassword() == null || request.getConfirmPassword().isBlank()) {
            throw new SignupException("Confirm password is required");
        }

        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new SignupException("Passwords do not match");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new SignupException("Email already exists");
        }

        Role role = roleRepository.findById(USER_ROLE_ID)
                .orElseThrow(() -> new RuntimeException("ROLE_USER not found"));

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(role);

        userRepository.save(user);
    }

    public UserAuthResponse signin(UserSigninRequestDto request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new UserSigninException("Invalid email or password")
                );

        boolean passwordMatches = passwordEncoder.matches(
                request.getPassword(),
                user.getPassword()
        );

        if (!passwordMatches) {
            throw new UserSigninException("Invalid email or password");
        }

        if (!"ROLE_USER".equals(user.getRole().getRoleName())) {
            throw new UserSigninException("Access denied: only user can sign in");
        }

        UserDetails userDetails = org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPassword())
                .authorities(user.getRole().getRoleName())
                .build();

        String jwtToken = jwtService.generateToken(
                userDetails,
                user.getRole().getRoleName()
        );

        return new UserAuthResponse(jwtToken);
    }
}
