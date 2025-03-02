package org.cloven.rbac_sample.repositories;

import org.cloven.rbac_sample.models.Action;
import org.cloven.rbac_sample.models.Permission;
import org.cloven.rbac_sample.models.Resource;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PermissionRepository extends CrudRepository<Permission, Integer> {
    Optional<Permission> findByResourceAndAction(Resource resource, Action action);
    boolean existsByResourceAndAction(Resource resource, Action action);
} 