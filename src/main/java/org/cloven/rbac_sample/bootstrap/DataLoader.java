package org.cloven.rbac_sample.bootstrap;

import org.cloven.rbac_sample.dtos.ActionDto;
import org.cloven.rbac_sample.dtos.PermissionDto;
import org.cloven.rbac_sample.dtos.ResourceDto;
import org.cloven.rbac_sample.dtos.RoleDto;
import org.cloven.rbac_sample.models.*;
import org.cloven.rbac_sample.repositories.RoleRepository;
import org.cloven.rbac_sample.repositories.UserRepository;
import org.cloven.rbac_sample.services.ActionService;
import org.cloven.rbac_sample.services.PermissionService;
import org.cloven.rbac_sample.services.ResourceService;
import org.cloven.rbac_sample.services.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final ResourceService resourceService;
    private final ActionService actionService;
    private final PermissionService permissionService;
    private final RoleService roleService;

    @Autowired
    public DataLoader(
            UserRepository userRepository,
            RoleRepository roleRepository,
            PasswordEncoder passwordEncoder,
            ResourceService resourceService,
            ActionService actionService,
            PermissionService permissionService,
            RoleService roleService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.resourceService = resourceService;
        this.actionService = actionService;
        this.permissionService = permissionService;
        this.roleService = roleService;
    }

    @Override
    public void run(String... args) throws Exception {
        // Skip this if running tests
        if (args.length > 0 && args[0].equals("test")) {
            return;
        }
        
        // Create roles if they don't exist
        createRolesIfNotExist();
        
        // Create admin user if it doesn't exist
        createAdminUserIfNotExist();
        
        // Create resources
        createResources();
        
        // Create actions
        createActions();
        
        // Create permissions
        createPermissions();
        
        // Assign permissions to roles
        assignPermissionsToRoles();
    }
    
    private void createRolesIfNotExist() {
        for (RoleEnum roleEnum : RoleEnum.values()) {
            if (roleRepository.findByName(roleEnum).isEmpty()) {
                RoleDto roleDto = new RoleDto();
                roleDto.setName(roleEnum);
                roleDto.setDescription(getDescriptionForRole(roleEnum));
                roleService.createRole(roleDto);
                System.out.println("Created role: " + roleEnum);
            }
        }
    }
    
    private String getDescriptionForRole(RoleEnum roleEnum) {
        switch (roleEnum) {
            case ADMIN:
                return "Administrator with full access";
            case MODERATOR:
                return "Moderator with limited administrative access";
            case USER:
                return "Regular user with basic access";
            default:
                return "Role description";
        }
    }
    
    private void createAdminUserIfNotExist() {
        if (!userRepository.existsByEmail("admin@example.com")) {
            Role adminRole = roleRepository.findByName(RoleEnum.ADMIN)
                    .orElseThrow(() -> new RuntimeException("Admin role not found"));
            
            User adminUser = new User();
            adminUser.setFullName("Admin User");
            adminUser.setEmail("admin@example.com");
            adminUser.setPassword(passwordEncoder.encode("admin123"));
            adminUser.setRole(adminRole);
            
            userRepository.save(adminUser);
            System.out.println("Created admin user: admin@example.com");
        }
    }
    
    private void createResources() {
        createResource("USER", "User management resource");
        createResource("ROLE", "Role management resource");
        createResource("PERMISSION", "Permission management resource");
        createResource("RESOURCE", "Resource management resource");
        createResource("ACTION", "Action management resource");
    }
    
    private void createResource(String name, String description) {
        try {
            ResourceDto resourceDto = new ResourceDto();
            resourceDto.setName(name);
            resourceDto.setDescription(description);
            resourceService.createResource(resourceDto);
            System.out.println("Created resource: " + name);
        } catch (Exception e) {
            System.out.println("Resource already exists: " + name);
        }
    }
    
    private void createActions() {
        createAction("CREATE", "Create operation");
        createAction("READ", "Read operation");
        createAction("UPDATE", "Update operation");
        createAction("DELETE", "Delete operation");
        createAction("LIST", "List all operation");
    }
    
    private void createAction(String name, String description) {
        try {
            ActionDto actionDto = new ActionDto();
            actionDto.setName(name);
            actionDto.setDescription(description);
            actionService.createAction(actionDto);
            System.out.println("Created action: " + name);
        } catch (Exception e) {
            System.out.println("Action already exists: " + name);
        }
    }
    
    private void createPermissions() {
        String[] resources = {"USER", "ROLE", "PERMISSION", "RESOURCE", "ACTION"};
        String[] actions = {"CREATE", "READ", "UPDATE", "DELETE", "LIST"};
        
        for (String resource : resources) {
            for (String action : actions) {
                createPermission(resource, action, resource + ":" + action + " permission");
            }
        }
    }
    
    private void createPermission(String resourceName, String actionName, String description) {
        try {
            PermissionDto permissionDto = new PermissionDto();
            permissionDto.setResourceName(resourceName);
            permissionDto.setActionName(actionName);
            permissionDto.setDescription(description);
            permissionService.createPermission(permissionDto);
            System.out.println("Created permission: " + resourceName + ":" + actionName);
        } catch (Exception e) {
            System.out.println("Permission already exists: " + resourceName + ":" + actionName);
        }
    }
    
    private void assignPermissionsToRoles() {
        // Get roles
        Role adminRole = roleRepository.findByName(RoleEnum.ADMIN)
                .orElseThrow(() -> new RuntimeException("Admin role not found"));
        
        Role moderatorRole = roleRepository.findByName(RoleEnum.MODERATOR)
                .orElseThrow(() -> new RuntimeException("Moderator role not found"));
        
        Role userRole = roleRepository.findByName(RoleEnum.USER)
                .orElseThrow(() -> new RuntimeException("User role not found"));
        
        // Assign all permissions to admin
        permissionService.getAllPermissions().forEach(permission -> {
            try {
                roleService.assignPermissionToRole(adminRole.getId(), permission.getId());
                System.out.println("Assigned permission " + permission.getName() + " to ADMIN role");
            } catch (Exception e) {
                // Permission already assigned
            }
        });
        
        // Assign read and list permissions to moderator for all resources
        permissionService.getAllPermissions().stream()
                .filter(permission -> 
                        permission.getAction().getName().equals("READ") || 
                        permission.getAction().getName().equals("LIST"))
                .forEach(permission -> {
                    try {
                        roleService.assignPermissionToRole(moderatorRole.getId(), permission.getId());
                        System.out.println("Assigned permission " + permission.getName() + " to MODERATOR role");
                    } catch (Exception e) {
                        // Permission already assigned
                    }
                });
        
        // Assign read and list permissions to user for USER resource only
        permissionService.getAllPermissions().stream()
                .filter(permission -> 
                        permission.getResource().getName().equals("USER") && 
                        (permission.getAction().getName().equals("READ") || 
                         permission.getAction().getName().equals("LIST")))
                .forEach(permission -> {
                    try {
                        roleService.assignPermissionToRole(userRole.getId(), permission.getId());
                        System.out.println("Assigned permission " + permission.getName() + " to USER role");
                    } catch (Exception e) {
                        // Permission already assigned
                    }
                });
    }
} 