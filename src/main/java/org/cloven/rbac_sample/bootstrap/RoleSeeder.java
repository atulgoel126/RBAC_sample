package org.cloven.rbac_sample.bootstrap;

import org.cloven.rbac_sample.dtos.RoleDto;
import org.cloven.rbac_sample.models.Role;
import org.cloven.rbac_sample.models.RoleEnum;
import org.cloven.rbac_sample.repositories.RoleRepository;
import org.cloven.rbac_sample.services.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
@Order(1)
public class RoleSeeder implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final RoleService roleService;

    @Autowired
    public RoleSeeder(RoleRepository roleRepository, RoleService roleService) {
        this.roleRepository = roleRepository;
        this.roleService = roleService;
    }

    @Override
    public void run(String... args) throws Exception {
        // Create default roles if they don't exist
        List<RoleEnum> roles = Arrays.asList(
                RoleEnum.ADMIN,
                RoleEnum.MODERATOR,
                RoleEnum.USER
        );

        for (RoleEnum roleEnum : roles) {
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
}
