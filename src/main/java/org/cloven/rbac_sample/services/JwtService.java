package org.cloven.rbac_sample.services;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger; // Added import
import org.slf4j.LoggerFactory; // Added import
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority; // Added import
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.List; // Added import
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors; // Added import

@Service
public class JwtService {
    private static final Logger logger = LoggerFactory.getLogger(JwtService.class); // Added logger

    @Value("${app.jwt.secret}")
    private String secretKey;

    @Value("${app.jwt.expiration-ms}")
    private long jwtExpiration;

    @Value("${app.jwt.refresh-expiration-ms}") // Added for refresh token
    private long jwtRefreshExpiration; // Added field

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public String generateToken(UserDetails userDetails) {
        // Log authorities for debugging
        logger.debug("Generating token for user: {}, Authorities: {}", userDetails.getUsername(), userDetails.getAuthorities());

        // Extract role names (prefixed with ROLE_) from authorities
        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .filter(authority -> authority.startsWith("ROLE_"))
                .collect(Collectors.toList());
        
        logger.debug("Extracted roles for JWT claim: {}", roles);

        // Create extra claims map and add roles
        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("roles", roles);

        return generateToken(extraClaims, userDetails);
    }

    public String generateToken(
            Map<String, Object> extraClaims,
            UserDetails userDetails
    ) {
        return Jwts
                .builder()
                .setClaims(extraClaims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration))
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // --- Refresh Token Generation ---
    public String generateRefreshToken(UserDetails userDetails) {
        // Refresh tokens usually only need the subject (username)
        return Jwts.builder()
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + jwtRefreshExpiration)) // Use refresh expiration
                .signWith(getSignInKey(), SignatureAlgorithm.HS256) // Consider HS512 if matching JwtUtils
                .compact();
    }
    // --- End Refresh Token Generation ---

    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    public long getExpirationTime() {
        return jwtExpiration;
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private Claims extractAllClaims(String token) {
        return Jwts
                .parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
    


