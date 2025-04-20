package org.cloven.rbac_sample.services;

import org.cloven.rbac_sample.dtos.RegisterUserDto;
import org.cloven.rbac_sample.dtos.UpdateUserDto;
import org.cloven.rbac_sample.exceptions.ResourceNotFoundException;
import org.cloven.rbac_sample.models.*;
import org.cloven.rbac_sample.repositories.RoleRepository;
import org.cloven.rbac_sample.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserService implements UserDetailsService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final PermissionService permissionService;

    @Autowired
    public UserService(
            UserRepository userRepository, 
            RoleRepository roleRepository, 
            PasswordEncoder passwordEncoder,
            PermissionService permissionService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.permissionService = permissionService;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
    }

    public List<User> getAllUsers() {
        List<User> users = new ArrayList<>();
        userRepository.findAll().forEach(users::add);
        return users;
    }

    public User getUserById(Integer id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }


    @Transactional
    public User createUser(RegisterUserDto registerUserDto) {
        // Check if role exists
        Role role = roleRepository.findByName(registerUserDto.getRole())
                .orElseThrow(() -> new ResourceNotFoundException("Role not found: " + registerUserDto.getRole()));

        User user = new User()
                .setFullName(registerUserDto.getFullName())
                .setEmail(registerUserDto.getEmail())
                .setPassword(passwordEncoder.encode(registerUserDto.getPassword()))
                .setRole(role);

        return userRepository.save(user);
    }

    @Transactional
    public User updateUser(Integer id, UpdateUserDto updateUserDto) {
        User user = getUserById(id);

        if (updateUserDto.getFullName() != null) {
            user.setFullName(updateUserDto.getFullName());
        }

        if (updateUserDto.getEmail() != null) {
            user.setEmail(updateUserDto.getEmail());
        }

        if (updateUserDto.getPassword() != null) {
            user.setPassword(passwordEncoder.encode(updateUserDto.getPassword()));
        }

        if (updateUserDto.getRole() != null) {
            Role role = roleRepository.findByName(updateUserDto.getRole())
                    .orElseThrow(() -> new ResourceNotFoundException("Role not found: " + updateUserDto.getRole()));
            user.setRole(role);
        }

        return userRepository.save(user);
    }

    @Transactional
    public void deleteUser(Integer id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }

    public boolean checkUserPermission(Integer userId, String resourceName, String actionName) {
        User user = getUserById(userId);
        Role role = user.getRole();
        
        Set<Permission> permissions = role.getPermissions();
        
        return permissions.stream()
                .anyMatch(permission -> 
                        permission.getResource().getName().equals(resourceName) && 
                        permission.getAction().getName().equals(actionName));
    }
}