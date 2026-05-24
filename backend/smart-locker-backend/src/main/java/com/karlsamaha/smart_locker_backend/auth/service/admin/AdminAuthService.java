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
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AdminAuthService {

    private static final String DEFAULT_SIGNUP_ROLE = "ROLE_ADMIN";

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AdminAuthService(UserRepository userRepository,
                            RoleRepository roleRepository,
                            PasswordEncoder passwordEncoder,
                            AuthenticationManager authenticationManager,
                            JwtService jwtService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    public AdminAuthResponse signup(AdminSignupRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new SignupException("Email already exists");
        }

        Role adminRole = roleRepository.findByRoleName(DEFAULT_SIGNUP_ROLE)
                .orElseThrow(() ->
                        new SignupException("Role not found: " + DEFAULT_SIGNUP_ROLE)
                );

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(adminRole);

        User savedUser = userRepository.save(user);

        UserDetails userDetails = org.springframework.security.core.userdetails.User
                .withUsername(savedUser.getName())
                .password(savedUser.getPassword())
                .authorities(savedUser.getRole().getRoleName())
                .build();

        String jwtToken = jwtService.generateToken(
                userDetails,
                savedUser.getRole().getRoleName()
        );

        return new AdminAuthResponse(jwtToken);
    }

    public AdminAuthResponse signin(AdminSigninRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new InvalidCredentialsException("Invalid email or password")
                );

        boolean passwordMatches = passwordEncoder.matches(
                request.getPassword(),
                user.getPassword()
        );

        if (!passwordMatches) {
            throw new InvalidCredentialsException("Invalid email or password");
        }

        if (!"ROLE_ADMIN".equals(user.getRole().getRoleName())) {
            throw new InvalidCredentialsException("Access denied: only admin can sign in");
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

        return new AdminAuthResponse(jwtToken);
    }
}