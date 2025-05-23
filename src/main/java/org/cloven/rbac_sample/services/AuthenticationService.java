package org.cloven.rbac_sample.services;

import jakarta.transaction.Transactional;
import org.cloven.rbac_sample.dtos.LoginUserDto;
import org.cloven.rbac_sample.dtos.RegisterUserDto;
import org.cloven.rbac_sample.dtos.RefreshTokenRequest; // Added import
import org.cloven.rbac_sample.dtos.RefreshTokenResponse; // Added import
import org.cloven.rbac_sample.models.Role;
import org.cloven.rbac_sample.models.RoleEnum;
import org.cloven.rbac_sample.models.User;
import org.cloven.rbac_sample.repositories.RoleRepository;
import org.cloven.rbac_sample.repositories.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails; // Added import
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.security.authentication.BadCredentialsException; // Added import

import java.util.Optional;

@Service
public class AuthenticationService {
    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final AuthenticationManager authenticationManager;
    private final RoleRepository roleRepository;
    private final JwtService jwtService; // Added JwtService dependency

    public AuthenticationService(
            UserRepository userRepository,
            AuthenticationManager authenticationManager,
            PasswordEncoder passwordEncoder,
            RoleRepository roleRepository,
            JwtService jwtService) { // Added JwtService to constructor
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.roleRepository = roleRepository;
        this.jwtService = jwtService; // Initialize JwtService
    }

    @Transactional
    public User signup(RegisterUserDto input) {

        Optional<Role> optionalRole = roleRepository.findByName(RoleEnum.USER);

        if (optionalRole.isEmpty()) {
            throw new RuntimeException("Default user role not found. Database may not be properly initialized");
        }

        User user = new User()
                .setFullName(input.getFullName())
                .setEmail(input.getEmail())
                .setPassword(passwordEncoder.encode(input.getPassword()))
                .setRole(optionalRole.get());
        return userRepository.save(user);
    }

   public User authenticate(LoginUserDto input) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        input.getEmail(),
                        input.getPassword()
                )
        );

        return userRepository.findByEmail(input.getEmail())
                .orElseThrow();
    }

    public RefreshTokenResponse refreshToken(RefreshTokenRequest request) {
        String refreshToken = request.getRefreshToken();
        String username = jwtService.extractUsername(refreshToken);

        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new BadCredentialsException("User not found for refresh token"));

        // Convert User to UserDetails if needed by isTokenValid, or adapt isTokenValid
        // Assuming User implements UserDetails or can be easily adapted
        UserDetails userDetails = user; // Direct cast if User implements UserDetails

        if (jwtService.isTokenValid(refreshToken, userDetails)) {
            String newAccessToken = jwtService.generateToken(userDetails);
            return new RefreshTokenResponse()
                    .setAccessToken(newAccessToken)
                    .setExpiresIn(jwtService.getExpirationTime());
        } else {
            throw new BadCredentialsException("Invalid refresh token");
        }
    }
}