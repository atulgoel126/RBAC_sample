package org.cloven.rbac_sample.responses;

import lombok.Data;
import org.cloven.rbac_sample.models.RoleEnum;

@Data
public class JwtResponse {
    private String token; // Access Token
    private String refreshToken; // Refresh Token
    private String type = "Bearer";
    private Integer id;
    private String fullName;
    private String email;
    private RoleEnum role;

    public JwtResponse(String token, String refreshToken, Integer id, String fullName, String email, RoleEnum role) {
        this.token = token;
        this.refreshToken = refreshToken;
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.role = role;
    }
} 