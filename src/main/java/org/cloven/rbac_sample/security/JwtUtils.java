package org.cloven.rbac_sample.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
// import org.cloven.rbac_sample.models.Role; // Removed unused import
import org.cloven.rbac_sample.models.User; // Keep this for now, might be needed elsewhere or contextually
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority; // Added import
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.List; // Added import
import java.util.stream.Collectors; // Added import

@Component
public class JwtUtils {
    private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);

    @Value("${app.jwt.secret}")
    private String jwtSecret;

    @Value("${app.jwt.expiration-ms}")
    private int jwtExpirationMs;

    @Value("${app.jwt.refresh-expiration-ms}") // Added for refresh token
    private long jwtRefreshExpirationMs; // Use long for potentially larger values

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    public String generateJwtToken(Authentication authentication) {
        // Get username from the principal (assuming it's UserDetails or similar)
        String username = authentication.getName(); // More standard way

        // Extract role names from authorities, filtering for actual roles (prefixed with ROLE_)
        List<String> roles = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .filter(authority -> authority.startsWith("ROLE_")) // Keep only role authorities
                .collect(Collectors.toList());

        return Jwts.builder()
                .setSubject(username) // Use username obtained via getName()
                .claim("roles", roles) // Add ONLY roles to the claim
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
                .signWith(getSigningKey(), SignatureAlgorithm.HS512)
                .compact();
    }

    public String getUsernameFromJwtToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public boolean validateJwtToken(String authToken) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(authToken);
            return true;
        } catch (MalformedJwtException e) {
            logger.error("Invalid JWT token: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            logger.error("JWT token is expired: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            logger.error("JWT token is unsupported: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            logger.error("JWT claims string is empty: {}", e.getMessage());
        }

        return false;
    }

    // --- Refresh Token Generation ---

    public String generateRefreshToken(Authentication authentication) {
        String username = authentication.getName();
        return Jwts.builder()
                .setSubject(username)
                // No need for roles or other claims in refresh token usually
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + jwtRefreshExpirationMs)) // Use refresh expiration
                .signWith(getSigningKey(), SignatureAlgorithm.HS512)
                .compact();
    }

    // Consider adding validation specific to refresh tokens if needed,
    // although often validation happens by checking against a persistent store.

}