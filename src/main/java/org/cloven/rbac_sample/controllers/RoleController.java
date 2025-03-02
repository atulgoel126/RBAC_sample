package org.cloven.rbac_sample.controllers;

import jakarta.validation.Valid;
import org.cloven.rbac_sample.dtos.RoleDto;
import org.cloven.rbac_sample.models.Role;
import org.cloven.rbac_sample.responses.ApiResponse;
import org.cloven.rbac_sample.services.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/roles")
@PreAuthorize("hasRole('ADMIN')")
public class RoleController {
    
    private final RoleService roleService;
    
    @Autowired
    public RoleController(RoleService roleService) {
        this.roleService = roleService;
    }
    
    @GetMapping
    public ResponseEntity<List<Role>> getAllRoles() {
        List<Role> roles = roleService.getAllRoles();
        return ResponseEntity.ok(roles);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Role> getRoleById(@PathVariable Integer id) {
        Role role = roleService.getRoleById(id);
        return ResponseEntity.ok(role);
    }
    
    @PostMapping
    public ResponseEntity<Role> createRole(@Valid @RequestBody RoleDto roleDto) {
        Role role = roleService.createRole(roleDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(role);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Role> updateRole(@PathVariable Integer id, @Valid @RequestBody RoleDto roleDto) {
        Role role = roleService.updateRole(id, roleDto);
        return ResponseEntity.ok(role);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteRole(@PathVariable Integer id) {
        roleService.deleteRole(id);
        return ResponseEntity.ok(ApiResponse.success("Role deleted successfully"));
    }
    
    @PostMapping("/{roleId}/permissions/{permissionId}")
    public ResponseEntity<Role> assignPermissionToRole(
            @PathVariable Integer roleId,
            @PathVariable Integer permissionId) {
        Role role = roleService.assignPermissionToRole(roleId, permissionId);
        return ResponseEntity.ok(role);
    }
    
    @DeleteMapping("/{roleId}/permissions/{permissionId}")
    public ResponseEntity<Role> revokePermissionFromRole(
            @PathVariable Integer roleId,
            @PathVariable Integer permissionId) {
        Role role = roleService.revokePermissionFromRole(roleId, permissionId);
        return ResponseEntity.ok(role);
    }
} 