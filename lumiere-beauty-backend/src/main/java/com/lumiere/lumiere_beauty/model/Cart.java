package com.lumiere.lumiere_beauty.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import com.lumiere.lumiere_beauty.model.User;
@Entity
@Table(name = "carts")
public class Cart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Foreign Key: user_id
    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // Default Constructor
    public Cart() {
    }

    // Parameterized Constructor
    public Cart(User user, LocalDateTime createdAt) {
        this.user = user;
        this.createdAt = createdAt;
    }

    // Getters and Setters
}