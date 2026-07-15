package com.placementtracker.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

/**
 * Handles everything related to creating and reading JWT (JSON Web Tokens).
 *
 * How JWT auth works in this app, in plain terms:
 * 1. Admin logs in with username/password -> we verify against the database.
 * 2. If correct, we generate a signed token (a string) containing the username
 *    and an expiry time, and send it back to the frontend.
 * 3. The frontend stores this token and sends it in the "Authorization" header
 *    on every future request: "Authorization: Bearer <token>".
 * 4. On each request, JwtAuthFilter reads the token, verifies the signature
 *    (proving it wasn't tampered with) and checks it hasn't expired.
 *
 * This means the server does NOT need to remember who's logged in (no session
 * storage) - the token itself carries the proof. This is why JWT auth is called
 * "stateless".
 */
@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration.ms}")
    private long expirationMs;

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    public String generateToken(String username) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + expirationMs);

        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(now)
                .setExpiration(expiry)
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractUsername(String token) {
        return extractAllClaims(token).getSubject();
    }

    public boolean isTokenValid(String token, String username) {
        String extractedUsername = extractUsername(token);
        return extractedUsername.equals(username) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractAllClaims(token).getExpiration().before(new Date());
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
