package com.karlsamaha.smart_locker_backend.security.jwt; // adjust to your package

import com.karlsamaha.smart_locker_backend.security.service.CustomUserDetailsService;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.NullSource;
import org.junit.jupiter.params.provider.ValueSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpHeaders;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.WebAuthenticationDetails;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class JwtAuthenticationFilterTest {

    private static final String TOKEN = "a.valid.token";
    private static final String EMAIL = "karl@example.com";

    @Mock
    private JwtService jwtService;

    @Mock
    private CustomUserDetailsService userDetailsService;

    @Mock
    private UserDetails userDetails;

    @Mock
    private FilterChain filterChain;

    @InjectMocks
    private JwtAuthenticationFilter filter;

    private MockHttpServletRequest request;
    private MockHttpServletResponse response;

    @BeforeEach
    void setUp() {
        request = new MockHttpServletRequest();
        response = new MockHttpServletResponse();
        SecurityContextHolder.clearContext();
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    private Authentication currentAuth() {
        return SecurityContextHolder.getContext().getAuthentication();
    }

    // 1. no header at all, or a header that isn't a Bearer scheme
    @ParameterizedTest
    @NullSource
    @ValueSource(strings = {"Basic dXNlcjpwYXNz", "bearer lowercase.token", "Token abc"})
    void skipsWhenHeaderIsMissingOrNotBearer(String header) throws Exception {
        if (header != null) {
            request.addHeader(HttpHeaders.AUTHORIZATION, header);
        }

        filter.doFilterInternal(request, response, filterChain);

        assertThat(currentAuth()).isNull();
        verifyNoInteractions(jwtService, userDetailsService);
        verify(filterChain, times(1)).doFilter(request, response);
    }

    // 2. "Bearer " with an empty token, and nothing already in the context
    @Test
    void skipsWhenTokenIsEmpty() throws Exception {
        request.addHeader(HttpHeaders.AUTHORIZATION, "Bearer    ");

        filter.doFilterInternal(request, response, filterChain);

        assertThat(currentAuth()).isNull();
        verifyNoInteractions(jwtService, userDetailsService);
        verify(filterChain, times(1)).doFilter(request, response);
    }

    // 3. token parses but carries no subject
    @Test
    void doesNotAuthenticateWhenEmailIsNull() throws Exception {
        request.addHeader(HttpHeaders.AUTHORIZATION, "Bearer " + TOKEN);
        when(jwtService.extractUsername(TOKEN)).thenReturn(null);

        filter.doFilterInternal(request, response, filterChain);

        assertThat(currentAuth()).isNull();
        verifyNoInteractions(userDetailsService);
        verify(filterChain, times(1)).doFilter(request, response);
    }

    // 4. user is found but the token doesn't validate against them
    @Test
    void doesNotAuthenticateWhenTokenIsInvalid() throws Exception {
        request.addHeader(HttpHeaders.AUTHORIZATION, "Bearer " + TOKEN);
        when(jwtService.extractUsername(TOKEN)).thenReturn(EMAIL);
        when(userDetailsService.loadUserByUsername(EMAIL)).thenReturn(userDetails);
        when(jwtService.isTokenValid(TOKEN, userDetails)).thenReturn(false);

        filter.doFilterInternal(request, response, filterChain);

        assertThat(currentAuth()).isNull();
        verify(jwtService, never()).extractRole(anyString());
        verify(filterChain, times(1)).doFilter(request, response);
    }

    // 5. valid token, but the role claim is missing or blank
    @ParameterizedTest
    @NullSource
    @ValueSource(strings = {"", "   "})
    void doesNotAuthenticateWhenRoleIsMissingOrBlank(String role) throws Exception {
        request.addHeader(HttpHeaders.AUTHORIZATION, "Bearer " + TOKEN);
        when(jwtService.extractUsername(TOKEN)).thenReturn(EMAIL);
        when(userDetailsService.loadUserByUsername(EMAIL)).thenReturn(userDetails);
        when(jwtService.isTokenValid(TOKEN, userDetails)).thenReturn(true);
        when(jwtService.extractRole(TOKEN)).thenReturn(role);

        filter.doFilterInternal(request, response, filterChain);

        assertThat(currentAuth()).isNull();
        verify(filterChain, times(1)).doFilter(request, response);
    }

    // 6. anything in the caught set blows up mid-way
    @Test
    void swallowsExceptionAndContinuesChain() throws Exception {
        request.addHeader(HttpHeaders.AUTHORIZATION, "Bearer " + TOKEN);
        when(jwtService.extractUsername(TOKEN)).thenThrow(new JwtException("expired"));

        filter.doFilterInternal(request, response, filterChain);

        assertThat(currentAuth()).isNull();
        verifyNoInteractions(userDetailsService);
        verify(filterChain, times(1)).doFilter(request, response);
    }

    @Test
    void swallowsUsernameNotFoundAndContinuesChain() throws Exception {
        request.addHeader(HttpHeaders.AUTHORIZATION, "Bearer " + TOKEN);
        when(jwtService.extractUsername(TOKEN)).thenReturn(EMAIL);
        when(userDetailsService.loadUserByUsername(EMAIL))
                .thenThrow(new UsernameNotFoundException("no such user"));

        filter.doFilterInternal(request, response, filterChain);

        assertThat(currentAuth()).isNull();
        verify(filterChain, times(1)).doFilter(request, response);
    }

    // 7. happy path
    @Test
    void authenticatesWhenEverythingIsValid() throws Exception {
        request.addHeader(HttpHeaders.AUTHORIZATION, "Bearer " + TOKEN);
        when(jwtService.extractUsername(TOKEN)).thenReturn(EMAIL);
        when(userDetailsService.loadUserByUsername(EMAIL)).thenReturn(userDetails);
        when(jwtService.isTokenValid(TOKEN, userDetails)).thenReturn(true);
        when(jwtService.extractRole(TOKEN)).thenReturn("ROLE_ADMIN");

        filter.doFilterInternal(request, response, filterChain);

        Authentication auth = currentAuth();
        assertThat(auth).isNotNull();
        assertThat(auth.getPrincipal()).isSameAs(userDetails);
        assertThat(auth.getCredentials()).isNull();
        assertThat(auth.isAuthenticated()).isTrue();
        assertThat(auth.getAuthorities())
                .extracting(GrantedAuthority::getAuthority)
                .containsExactly("ROLE_ADMIN");
        assertThat(auth.getDetails()).isInstanceOf(WebAuthenticationDetails.class);
        verify(filterChain, times(1)).doFilter(request, response);
    }
}