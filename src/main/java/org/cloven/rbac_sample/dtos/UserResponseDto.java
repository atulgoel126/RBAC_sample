package org.cloven.rbac_sample.dtos;

import org.cloven.rbac_sample.models.Role;
import org.cloven.rbac_sample.models.User;

import java.time.LocalDateTime;
import java.time.ZoneId;

public class UserResponseDto {
    private Integer id;
    private String email;
    private String fullName;
    private String roleName;
    private Integer roleId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public UserResponseDto() {
    }
    
    public static UserResponseDto fromEntity(User user) {
        UserResponseDto dto = new UserResponseDto();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setFullName(user.getFullName());
        
        // Handle role information
        if (user.getRole() != null) {
            dto.setRoleName(user.getRole().getName().toString());
            dto.setRoleId(user.getRole().getId());
        }
        
        // Convert Date to LocalDateTime
        if (user.getCreatedAt() != null) {
            dto.setCreatedAt(user.getCreatedAt().toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime());
        }
        
        if (user.getUpdatedAt() != null) {
            dto.setUpdatedAt(user.getUpdatedAt().toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime());
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
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getFullName() {
        return fullName;
    }
    
    public void setFullName(String fullName) {
        this.fullName = fullName;
    }
    
    public String getRoleName() {
        return roleName;
    }
    
    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }
    
    public Integer getRoleId() {
        return roleId;
    }
    
    public void setRoleId(Integer roleId) {
        this.roleId = roleId;
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
} 