package org.cloven.rbac_sample.dtos;

import org.cloven.rbac_sample.models.Permission;
import org.cloven.rbac_sample.models.Role;
import org.cloven.rbac_sample.models.RoleEnum;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.Set;
import java.util.stream.Collectors;

public class RoleResponseDto {
    private Integer id;
    private String name;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Set<PermissionDto> permissions;
    
    public RoleResponseDto() {
    }
    
    public static RoleResponseDto fromEntity(Role role) {
        RoleResponseDto dto = new RoleResponseDto();
        dto.setId(role.getId());
        dto.setName(role.getName().toString());
        dto.setDescription(role.getDescription());
        
        // Convert Date to LocalDateTime
        if (role.getCreatedAt() != null) {
            dto.setCreatedAt(role.getCreatedAt().toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime());
        }
        
        if (role.getUpdatedAt() != null) {
            dto.setUpdatedAt(role.getUpdatedAt().toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime());
        }
        
        if (role.getPermissions() != null) {
            dto.setPermissions(role.getPermissions().stream()
                    .map(PermissionDto::fromEntity)
                    .collect(Collectors.toSet()));
        }
        
        return dto;
    }
    
    // Getters and Setters
    
    public Integer getId() {
        return id;
    }
    
    public void setId(Integer id) {
        this.id = id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    public Set<PermissionDto> getPermissions() {
        return permissions;
    }
    
    public void setPermissions(Set<PermissionDto> permissions) {
        this.permissions = permissions;
    }
} 