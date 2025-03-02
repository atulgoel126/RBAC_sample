package org.cloven.rbac_sample.dtos;

import org.cloven.rbac_sample.models.Action;
import org.cloven.rbac_sample.models.Permission;
import org.cloven.rbac_sample.models.Resource;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;

public class PermissionDto {
    private Integer id;
    private String name;
    private String description;
    private Integer resourceId;
    private String resourceName;
    private Integer actionId;
    private String actionName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public PermissionDto() {
    }
    
    public static PermissionDto fromEntity(Permission permission) {
        PermissionDto dto = new PermissionDto();
        dto.setId(permission.getId());
        dto.setName(permission.getName());
        dto.setDescription(permission.getDescription());
        
        // Convert Date to LocalDateTime
        if (permission.getCreatedAt() != null) {
            dto.setCreatedAt(permission.getCreatedAt().toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime());
        }
        
        if (permission.getUpdatedAt() != null) {
            dto.setUpdatedAt(permission.getUpdatedAt().toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime());
        }
        
        if (permission.getResource() != null) {
            dto.setResourceId(permission.getResource().getId());
            dto.setResourceName(permission.getResource().getName());
        }
        
        if (permission.getAction() != null) {
            dto.setActionId(permission.getAction().getId());
            dto.setActionName(permission.getAction().getName());
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
    
    public Integer getResourceId() {
        return resourceId;
    }
    
    public void setResourceId(Integer resourceId) {
        this.resourceId = resourceId;
    }
    
    public String getResourceName() {
        return resourceName;
    }
    
    public void setResourceName(String resourceName) {
        this.resourceName = resourceName;
    }
    
    public Integer getActionId() {
        return actionId;
    }
    
    public void setActionId(Integer actionId) {
        this.actionId = actionId;
    }
    
    public String getActionName() {
        return actionName;
    }
    
    public void setActionName(String actionName) {
        this.actionName = actionName;
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