package org.cloven.rbac_sample.repositories;

import org.cloven.rbac_sample.models.Action;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ActionRepository extends CrudRepository<Action, Integer> {
    Optional<Action> findByName(String name);
    boolean existsByName(String name);
} 