package org.cloven.rbac_sample.services;

import org.cloven.rbac_sample.dtos.RoleDto;
import org.cloven.rbac_sample.exceptions.ResourceAlreadyExistsException;
import org.cloven.rbac_sample.exceptions.ResourceNotFoundException;
import org.cloven.rbac_sample.models.Permission;
import org.cloven.rbac_sample.models.Role;
import org.cloven.rbac_sample.models.RoleEnum;
import org.cloven.rbac_sample.repositories.PermissionRepository;
import org.cloven.rbac_sample.repositories.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class RoleService {
    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;

    @Autowired
    public RoleService(RoleRepository roleRepository, PermissionRepository permissionRepository) {
        this.roleRepository = roleRepository;
        this.permissionRepository = permissionRepository;
    }

    public List<Role> getAllRoles() {
        List<Role> roles = new ArrayList<>();
        roleRepository.findAll().forEach(roles::add);
        return roles;
    }

    public Role getRoleById(Integer id) {
        return roleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found with id: " + id));
    }

    public Role getRoleByName(RoleEnum name) {
        return roleRepository.findByName(name)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found with name: " + name));
    }

    @Transactional
    public Role createRole(RoleDto roleDto) {
        // Check if role with same name already exists
        if (roleRepository.findByName(roleDto.getName()).isPresent()) {
            throw new ResourceAlreadyExistsException("Role already exists with name: " + roleDto.getName());
        }

        Role role = new Role()
                .setName(roleDto.getName())
                .setDescription(roleDto.getDescription());

        return roleRepository.save(role);
    }

    @Transactional
    public Role updateRole(Integer id, RoleDto roleDto) {
        Role role = getRoleById(id);

        if (roleDto.getName() != null && role.getName() != roleDto.getName()) {
            // Check if role with new name already exists
            if (roleRepository.findByName(roleDto.getName()).isPresent()) {
                throw new ResourceAlreadyExistsException("Role already exists with name: " + roleDto.getName());
            }
            role.setName(roleDto.getName());
        }

        if (roleDto.getDescription() != null) {
            role.setDescription(roleDto.getDescription());
        }

        return roleRepository.save(role);
    }

    @Transactional
    public void deleteRole(Integer id) {
        if (!roleRepository.existsById(id)) {
            throw new ResourceNotFoundException("Role not found with id: " + id);
        }
        roleRepository.deleteById(id);
    }

    @Transactional
    public Role assignPermissionToRole(Integer roleId, Integer permissionId) {
        Role role = getRoleById(roleId);
        
        Permission permission = permissionRepository.findById(permissionId)
                .orElseThrow(() -> new ResourceNotFoundException("Permission not found with id: " + permissionId));
        
        role.addPermission(permission);
        return roleRepository.save(role);
    }

    @Transactional
    public Role revokePermissionFromRole(Integer roleId, Integer permissionId) {
        Role role = getRoleById(roleId);
        
        Permission permission = permissionRepository.findById(permissionId)
                .orElseThrow(() -> new ResourceNotFoundException("Permission not found with id: " + permissionId));
        
        role.removePermission(permission);
        return roleRepository.save(role);
    }
} 