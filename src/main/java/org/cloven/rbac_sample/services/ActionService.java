package org.cloven.rbac_sample.services;

import org.cloven.rbac_sample.dtos.ActionDto;
import org.cloven.rbac_sample.exceptions.ResourceAlreadyExistsException;
import org.cloven.rbac_sample.exceptions.ResourceNotFoundException;
import org.cloven.rbac_sample.models.Action;
import org.cloven.rbac_sample.repositories.ActionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class ActionService {
    private final ActionRepository actionRepository;

    @Autowired
    public ActionService(ActionRepository actionRepository) {
        this.actionRepository = actionRepository;
    }

    public List<Action> getAllActions() {
        List<Action> actions = new ArrayList<>();
        actionRepository.findAll().forEach(actions::add);
        return actions;
    }

    public Action getActionById(Integer id) {
        return actionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Action not found with id: " + id));
    }
    
    public Action getActionByName(String name) {
        return actionRepository.findByName(name)
                .orElseThrow(() -> new ResourceNotFoundException("Action not found with name: " + name));
    }

    @Transactional
    public Action createAction(ActionDto actionDto) {
        // Check if action already exists
        if (actionRepository.existsByName(actionDto.getName())) {
            throw new ResourceAlreadyExistsException("Action already exists with name: " + actionDto.getName());
        }
        
        Action action = new Action()
                .setName(actionDto.getName())
                .setDescription(actionDto.getDescription());
        
        return actionRepository.save(action);
    }

    @Transactional
    public Action updateAction(Integer id, ActionDto actionDto) {
        Action action = getActionById(id);
        
        if (actionDto.getName() != null && !action.getName().equals(actionDto.getName())) {
            // Check if action with new name already exists
            if (actionRepository.existsByName(actionDto.getName())) {
                throw new ResourceAlreadyExistsException("Action already exists with name: " + actionDto.getName());
            }
            action.setName(actionDto.getName());
        }
        
        if (actionDto.getDescription() != null) {
            action.setDescription(actionDto.getDescription());
        }
        
        return actionRepository.save(action);
    }

    @Transactional
    public void deleteAction(Integer id) {
        if (!actionRepository.existsById(id)) {
            throw new ResourceNotFoundException("Action not found with id: " + id);
        }
        actionRepository.deleteById(id);
    }
} 