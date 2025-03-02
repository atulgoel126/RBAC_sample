package org.cloven.rbac_sample.repositories;

import org.cloven.rbac_sample.models.Resource;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ResourceRepository extends CrudRepository<Resource, Integer> {
    Optional<Resource> findByName(String name);
    boolean existsByName(String name);
} 