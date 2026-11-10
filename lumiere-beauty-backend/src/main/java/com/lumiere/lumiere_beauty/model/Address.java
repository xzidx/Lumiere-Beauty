package com.lumiere.lumiere_beauty.model;

import jakarta.persistence.*;
import com.lumiere.lumiere_beauty.model.User;
@Entity
@Table(name = "addresses")
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Foreign Key: user_id
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "recipient_name", nullable = false, length = 100)
    private String recipientName;

    @Column(nullable = false, length = 20)
    private String phone;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String address;

    @Column(nullable = false, length = 100)
    private String city;

    // Default Constructor
    public Address() {
    }

    // Parameterized Constructor
    public Address(User user, String recipientName, String phone,
                   String address, String city) {
        this.user = user;
        this.recipientName = recipientName;
        this.phone = phone;
        this.address = address;
        this.city = city;
    }

    // Getters and Setters
}