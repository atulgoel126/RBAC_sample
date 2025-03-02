package org.cloven.rbac_sample.responses;

import lombok.Data;
import org.cloven.rbac_sample.models.RoleEnum;

@Data
public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private Integer id;
    private String fullName;
    private String email;
    private RoleEnum role;
    
    public JwtResponse(String token, Integer id, String fullName, String email, RoleEnum role) {
        this.token = token;
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.role = role;
    }
} 