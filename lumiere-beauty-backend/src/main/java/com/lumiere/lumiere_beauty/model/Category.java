package com.lumiere.lumiere_beauty.model;

import jakarta.persistence.*;

@Entity
@Table(name = "categories")
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    // Default Constructor
    public Category() {
    }

    // Parameterized Constructor
    public Category(String name, String description) {
        this.name = name;
        this.description = description;
    }

    // Getters and Setters
}