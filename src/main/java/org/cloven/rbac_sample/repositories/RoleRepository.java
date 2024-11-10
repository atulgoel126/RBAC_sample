package org.cloven.rbac_sample.repositories;

import org.cloven.rbac_sample.models.Role;
import org.cloven.rbac_sample.models.RoleEnum;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends CrudRepository<Role, Integer> {
    Optional<Role> findByName(RoleEnum name);
}