package com.placementtracker.controller;

import com.placementtracker.dto.ApiResponse;
import com.placementtracker.dto.LoginRequest;
import com.placementtracker.dto.LoginResponse;
import com.placementtracker.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    // POST http://localhost:8080/api/auth/login
    // Body: { "username": "admin", "password": "Admin@123" }
    @PostMapping("/login")
    public ApiResponse<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        return ApiResponse.success("Login successful", response);
    }

    // Logout is stateless with JWT - there's nothing to invalidate server-side.
    // The frontend simply deletes the token it's holding. This endpoint exists
    // mainly so the frontend has a clear, explicit action to call.
    @PostMapping("/logout")
    public ApiResponse<Void> logout() {
        return ApiResponse.success("Logout successful", null);
    }
}
