package org.cloven.rbac_sample.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PermissionDto {
    @NotBlank(message = "Resource name is required")
    private String resourceName;
    
    @NotBlank(message = "Action name is required")
    private String actionName;
    
    private String description;
} 