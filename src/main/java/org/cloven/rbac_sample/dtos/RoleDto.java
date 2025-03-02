package org.cloven.rbac_sample.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.cloven.rbac_sample.models.RoleEnum;

@Getter
@Setter
public class RoleDto {
    @NotNull(message = "Role name is required")
    private RoleEnum name;
    
    @NotBlank(message = "Description is required")
    private String description;
} 