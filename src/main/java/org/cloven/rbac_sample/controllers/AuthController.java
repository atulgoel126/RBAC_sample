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
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
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
    public ResponseEntity<JwtResponse> authenticateUser(@Valid @RequestBody LoginDto loginDto) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginDto.getEmail(), loginDto.getPassword()));
        
        SecurityContextHolder.getContext().setAuthentication(authentication);
        User user = (User) authentication.getPrincipal();
        
        String jwt = jwtService.generateToken(user);
        
        return ResponseEntity.ok(new JwtResponse(
                jwt,
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole().getName()));
    }
    
    @PostMapping("/signup")
    public ResponseEntity<User> registerUser(@Valid @RequestBody RegisterUserDto registerUserDto) {
        User user = userService.createUser(registerUserDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(user);
    }
    
    @PostMapping("/signout")
    public ResponseEntity<ApiResponse> logoutUser() {
        // In a stateless JWT implementation, the client simply discards the token
        // For added security, you could implement a token blacklist here
        return ResponseEntity.ok(ApiResponse.success("Logged out successfully"));
    }
} 