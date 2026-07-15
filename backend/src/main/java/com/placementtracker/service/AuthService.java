package com.placementtracker.service;

import com.placementtracker.dto.LoginRequest;
import com.placementtracker.dto.LoginResponse;
import com.placementtracker.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public LoginResponse login(LoginRequest request) {
        // This line does the actual password check: it calls into
        // CustomUserDetailsService to load the admin, then compares the
        // submitted password against the stored BCrypt hash.
        // If it fails, Spring Security throws BadCredentialsException,
        // which GlobalExceptionHandler turns into a clean 401 response.
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        String token = jwtUtil.generateToken(request.getUsername());
        return new LoginResponse(token, request.getUsername());
    }
}
