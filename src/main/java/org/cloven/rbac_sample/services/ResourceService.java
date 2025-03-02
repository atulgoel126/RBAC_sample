package org.cloven.rbac_sample.services;

import org.cloven.rbac_sample.dtos.ResourceDto;
import org.cloven.rbac_sample.exceptions.ResourceAlreadyExistsException;
import org.cloven.rbac_sample.exceptions.ResourceNotFoundException;
import org.cloven.rbac_sample.models.Resource;
import org.cloven.rbac_sample.repositories.ResourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class ResourceService {
    private final ResourceRepository resourceRepository;

    @Autowired
    public ResourceService(ResourceRepository resourceRepository) {
        this.resourceRepository = resourceRepository;
    }

    public List<Resource> getAllResources() {
        List<Resource> resources = new ArrayList<>();
        resourceRepository.findAll().forEach(resources::add);
        return resources;
    }

    public Resource getResourceById(Integer id) {
        return resourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + id));
    }
    
    public Resource getResourceByName(String name) {
        return resourceRepository.findByName(name)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with name: " + name));
    }

    @Transactional
    public Resource createResource(ResourceDto resourceDto) {
        // Check if resource already exists
        if (resourceRepository.existsByName(resourceDto.getName())) {
            throw new ResourceAlreadyExistsException("Resource already exists with name: " + resourceDto.getName());
        }
        
        Resource resource = new Resource()
                .setName(resourceDto.getName())
                .setDescription(resourceDto.getDescription());
        
        return resourceRepository.save(resource);
    }

    @Transactional
    public Resource updateResource(Integer id, ResourceDto resourceDto) {
        Resource resource = getResourceById(id);
        
        if (resourceDto.getName() != null && !resource.getName().equals(resourceDto.getName())) {
            // Check if resource with new name already exists
            if (resourceRepository.existsByName(resourceDto.getName())) {
                throw new ResourceAlreadyExistsException("Resource already exists with name: " + resourceDto.getName());
            }
            resource.setName(resourceDto.getName());
        }
        
        if (resourceDto.getDescription() != null) {
            resource.setDescription(resourceDto.getDescription());
        }
        
        return resourceRepository.save(resource);
    }

    @Transactional
    public void deleteResource(Integer id) {
        if (!resourceRepository.existsById(id)) {
            throw new ResourceNotFoundException("Resource not found with id: " + id);
        }
        resourceRepository.deleteById(id);
    }
} 