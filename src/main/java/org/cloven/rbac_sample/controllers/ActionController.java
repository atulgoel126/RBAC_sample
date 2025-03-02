package org.cloven.rbac_sample.controllers;

import jakarta.validation.Valid;
import org.cloven.rbac_sample.dtos.ActionDto;
import org.cloven.rbac_sample.models.Action;
import org.cloven.rbac_sample.responses.ApiResponse;
import org.cloven.rbac_sample.services.ActionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/actions")
@PreAuthorize("hasRole('ADMIN')")
public class ActionController {
    
    private final ActionService actionService;
    
    @Autowired
    public ActionController(ActionService actionService) {
        this.actionService = actionService;
    }
    
    @GetMapping
    public ResponseEntity<List<Action>> getAllActions() {
        List<Action> actions = actionService.getAllActions();
        return ResponseEntity.ok(actions);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Action> getActionById(@PathVariable Integer id) {
        Action action = actionService.getActionById(id);
        return ResponseEntity.ok(action);
    }
    
    @PostMapping
    public ResponseEntity<Action> createAction(@Valid @RequestBody ActionDto actionDto) {
        Action action = actionService.createAction(actionDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(action);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Action> updateAction(@PathVariable Integer id, @Valid @RequestBody ActionDto actionDto) {
        Action action = actionService.updateAction(id, actionDto);
        return ResponseEntity.ok(action);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteAction(@PathVariable Integer id) {
        actionService.deleteAction(id);
        return ResponseEntity.ok(ApiResponse.success("Action deleted successfully"));
    }
} 