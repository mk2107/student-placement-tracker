package com.placementtracker.security;

import com.placementtracker.entity.Admin;
import com.placementtracker.repository.AdminRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

/**
 * Spring Security needs to know how to look up a user by username.
 * We plug in our own logic here: look the Admin up in MySQL via AdminRepository,
 * then wrap it in Spring Security's own User object.
 */
@Service
@RequiredArgsConstructor // Lombok: generates a constructor for all "final" fields (dependency injection)
public class CustomUserDetailsService implements UserDetailsService {

    private final AdminRepository adminRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Admin admin = adminRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Admin not found: " + username));

        // Every admin gets the same single role - this app only has one type of user.
        return new User(
                admin.getUsername(),
                admin.getPasswordHash(),
                Collections.singletonList(() -> "ROLE_ADMIN")
        );
    }
}
