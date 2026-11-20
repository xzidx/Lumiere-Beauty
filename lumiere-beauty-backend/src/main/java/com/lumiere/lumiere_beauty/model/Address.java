package com.lumiere.lumiere_beauty.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonProperty;
@Entity
@Table(name = "addresses")
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Foreign Key: user_id
   @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonProperty("user")
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

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getRecipientName() {
        return recipientName;
    }

    public void setRecipientName(String recipientName) {
        this.recipientName = recipientName;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }
}