package org.cloven.rbac_sample.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import com.fasterxml.jackson.annotation.JsonIgnore; // Add import

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "resources")
@Getter
@Setter
@Accessors(chain = true)
public class Resource {
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(nullable = false)
    private Integer id;
    
    @Column(nullable = false, unique = true)
    private String name;
    
    private String description;
    
    @CreationTimestamp
    @Column(updatable = false, name = "created_at")
    private Date createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Date updatedAt;
    
    @OneToMany(mappedBy = "resource", cascade = CascadeType.ALL)
    @JsonIgnore // Add this to prevent serialization of this collection when Resource is serialized
    private Set<Permission> permissions = new HashSet<>();
}