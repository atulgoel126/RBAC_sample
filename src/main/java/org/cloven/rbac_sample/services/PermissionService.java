package org.cloven.rbac_sample.services;

import org.cloven.rbac_sample.dtos.PermissionDto;
import org.cloven.rbac_sample.exceptions.ResourceAlreadyExistsException;
import org.cloven.rbac_sample.exceptions.ResourceNotFoundException;
import org.cloven.rbac_sample.models.Action;
import org.cloven.rbac_sample.models.Permission;
import org.cloven.rbac_sample.models.Resource;
import org.cloven.rbac_sample.repositories.ActionRepository;
import org.cloven.rbac_sample.repositories.PermissionRepository;
import org.cloven.rbac_sample.repositories.ResourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class PermissionService {
    private final PermissionRepository permissionRepository;
    private final ResourceRepository resourceRepository;
    private final ActionRepository actionRepository;

    @Autowired
    public PermissionService(
            PermissionRepository permissionRepository,
            ResourceRepository resourceRepository,
            ActionRepository actionRepository) {
        this.permissionRepository = permissionRepository;
        this.resourceRepository = resourceRepository;
        this.actionRepository = actionRepository;
    }

    public List<Permission> getAllPermissions() {
        List<Permission> permissions = new ArrayList<>();
        permissionRepository.findAll().forEach(permissions::add);
        return permissions;
    }

    public Permission getPermissionById(Integer id) {
        return permissionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Permission not found with id: " + id));
    }

    @Transactional
    public Permission createPermission(PermissionDto permissionDto) {
        Resource resource = resourceRepository.findByName(permissionDto.getResourceName())
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with name: " + permissionDto.getResourceName()));
        
        Action action = actionRepository.findByName(permissionDto.getActionName())
                .orElseThrow(() -> new ResourceNotFoundException("Action not found with name: " + permissionDto.getActionName()));
        
        // Check if permission already exists
        if (permissionRepository.existsByResourceAndAction(resource, action)) {
            throw new ResourceAlreadyExistsException("Permission already exists for resource '" + 
                    permissionDto.getResourceName() + "' and action '" + permissionDto.getActionName() + "'");
        }
        
        Permission permission = new Permission()
                .setResource(resource)
                .setAction(action)
                .setDescription(permissionDto.getDescription());
        
        return permissionRepository.save(permission);
    }

    @Transactional
    public void deletePermission(Integer id) {
        if (!permissionRepository.existsById(id)) {
            throw new ResourceNotFoundException("Permission not found with id: " + id);
        }
        permissionRepository.deleteById(id);
    }

    @Transactional
    public Permission updatePermissionDescription(Integer id, String description) {
        Permission permission = getPermissionById(id); // Reuse existing method to find or throw exception
        permission.setDescription(description);
        return permissionRepository.save(permission);
    }

} 