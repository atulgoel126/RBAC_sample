package org.cloven.rbac_sample.controllers;

import jakarta.validation.Valid;
import org.cloven.rbac_sample.dtos.LoginDto;
import org.cloven.rbac_sample.dtos.RegisterUserDto;
import org.cloven.rbac_sample.models.User;
import org.cloven.rbac_sample.responses.ApiResponse;
import org.cloven.rbac_sample.responses.JwtResponse;
import org.cloven.rbac_sample.services.JwtService;
import org.cloven.rbac_sample.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "Authentication management APIs")
public class AuthController {
    
    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final JwtService jwtService;
    
    @Autowired
    public AuthController(
            AuthenticationManager authenticationManager,
            UserService userService,
            JwtService jwtService) {
        this.authenticationManager = authenticationManager;
        this.userService = userService;
        this.jwtService = jwtService;
    }
    
    @PostMapping("/signin")
    @Operation(summary = "Sign in a user", description = "Authenticates a user and returns a JWT token")
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Successfully authenticated",
                content = @Content(mediaType = "application/json", 
                schema = @Schema(implementation = JwtResponse.class))),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Bad credentials", 
                content = @Content(mediaType = "application/json"))
    })
    public ResponseEntity<JwtResponse> authenticateUser(@Valid @RequestBody LoginDto loginDto) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginDto.getEmail(), loginDto.getPassword()));
        
        SecurityContextHolder.getContext().setAuthentication(authentication);
        User user = (User) authentication.getPrincipal();
        
        String jwt = jwtService.generateToken(user);
        String refreshToken = jwtService.generateRefreshToken(user); // Generate refresh token
        
        return ResponseEntity.ok(new JwtResponse(
                jwt,
                refreshToken, // Include refresh token in response
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole().getName()));
    }
    
    @PostMapping("/signup")
    @Operation(summary = "Register a new user", description = "Creates a new user account with specified roles")
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Successfully registered"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Email already in use or invalid role")
    })
    public ResponseEntity<User> registerUser(@Valid @RequestBody RegisterUserDto registerUserDto) {
        User user = userService.createUser(registerUserDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(user);
    }
    
    @PostMapping("/signout")
    @Operation(summary = "Sign out a user", description = "Logs out the current user session")
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Successfully logged out")
    })
    public ResponseEntity<ApiResponse> logoutUser() {
        // In a stateless JWT implementation, the client simply discards the token
        // For added security, you could implement a token blacklist here
        return ResponseEntity.ok(ApiResponse.success("Logged out successfully"));
    }
} 