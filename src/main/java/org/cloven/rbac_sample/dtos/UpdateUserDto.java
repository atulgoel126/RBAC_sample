package org.cloven.rbac_sample.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.cloven.rbac_sample.models.RoleEnum;

@Getter
@Setter
public class UpdateUserDto {
    private String fullName;
    
    @Email(message = "Email should be valid")
    private String email;
    
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;
    
    private RoleEnum role;
} 