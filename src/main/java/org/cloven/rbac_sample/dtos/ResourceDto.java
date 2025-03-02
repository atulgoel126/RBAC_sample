package org.cloven.rbac_sample.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResourceDto {
    @NotBlank(message = "Name is required")
    private String name;
    
    private String description;
} 