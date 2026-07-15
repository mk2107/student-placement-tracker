package com.placementtracker.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Intercepts EVERY incoming HTTP request exactly once, before it reaches any
 * controller. Its job: look for "Authorization: Bearer <token>", validate it,
 * and if valid, tell Spring Security "this request is authenticated as this user".
 *
 * If there's no token, or it's invalid, we simply do nothing here and let the
 * request continue - it will then be rejected later by SecurityConfig's rules
 * (since the endpoint requires authentication) UNLESS it's a public endpoint like /api/auth/login.
 */
@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response); // no token - let it pass through, security rules decide next
            return;
        }

        String token = authHeader.substring(7); // strip "Bearer " prefix

        try {
            String username = jwtUtil.extractUsername(token);

            // Only set authentication if it isn't already set for this request.
            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                if (jwtUtil.isTokenValid(token, userDetails.getUsername())) {
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities()
                    );
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        } catch (Exception ex) {
            // Invalid/expired/malformed token - simply don't authenticate.
            // The request will be rejected downstream as "unauthenticated".
            SecurityContextHolder.clearContext();
        }

        filterChain.doFilter(request, response);
    }
}
