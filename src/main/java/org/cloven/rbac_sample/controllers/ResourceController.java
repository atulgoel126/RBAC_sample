package org.cloven.rbac_sample.controllers;

import jakarta.validation.Valid;
import org.cloven.rbac_sample.dtos.ResourceDto;
import org.cloven.rbac_sample.models.Resource;
import org.cloven.rbac_sample.responses.ApiResponse;
import org.cloven.rbac_sample.services.ResourceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resources")
@PreAuthorize("hasRole('ADMIN')")
public class ResourceController {
    
    private final ResourceService resourceService;
    
    @Autowired
    public ResourceController(ResourceService resourceService) {
        this.resourceService = resourceService;
    }
    
    @GetMapping
    public ResponseEntity<List<Resource>> getAllResources() {
        List<Resource> resources = resourceService.getAllResources();
        return ResponseEntity.ok(resources);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Resource> getResourceById(@PathVariable Integer id) {
        Resource resource = resourceService.getResourceById(id);
        return ResponseEntity.ok(resource);
    }
    
    @PostMapping
    public ResponseEntity<Resource> createResource(@Valid @RequestBody ResourceDto resourceDto) {
        Resource resource = resourceService.createResource(resourceDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(resource);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Resource> updateResource(@PathVariable Integer id, @Valid @RequestBody ResourceDto resourceDto) {
        Resource resource = resourceService.updateResource(id, resourceDto);
        return ResponseEntity.ok(resource);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteResource(@PathVariable Integer id) {
        resourceService.deleteResource(id);
        return ResponseEntity.ok(ApiResponse.success("Resource deleted successfully"));
    }
} 