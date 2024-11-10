package org.cloven.rbac_sample.services;

import org.cloven.rbac_sample.dtos.RegisterUserDto;
import org.cloven.rbac_sample.models.Role;
import org.cloven.rbac_sample.models.RoleEnum;
import org.cloven.rbac_sample.models.User;
import org.cloven.rbac_sample.repositories.RoleRepository;
import org.cloven.rbac_sample.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
    }

    public List<User> allUsers() {
        List<User> users = new ArrayList<>();

        userRepository.findAll().forEach(users::add);

        return users;
    }
}