package com.lumiere.lumiere_beauty.model;

import jakarta.persistence.*;

@Entity
@Table(name = "brands")
public class Brand {

    // Primary Key
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Brand Attributes
    @Column(nullable = false, unique = true, length = 100)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    // Default Constructor
    public Brand() {
    }

    // Parameterized Constructor
    public Brand(String name, String description) {
        this.name = name;
        this.description = description;
    }

    // Getters and Setters
}
