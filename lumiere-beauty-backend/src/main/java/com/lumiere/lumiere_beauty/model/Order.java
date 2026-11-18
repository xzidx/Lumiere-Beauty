package com.lumiere.lumiere_beauty.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
@Getter
@Setter
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Foreign Key: user_id
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Foreign Key: address_id
    @ManyToOne
    @JoinColumn(name = "address_id", nullable = false)
    private Address address;
    
    @Column(name = "order_number", unique = true, length = 50)
    private String orderNumber;

    @Column(name = "total_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @Column(nullable = false, length = 30)
    private String status;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // Default Constructor
    public Order() {
    }

    // Parameterized Constructor
    public Order(User user, Address address, String orderNumber,
                 BigDecimal totalAmount, String status,
                 LocalDateTime createdAt) {
        this.user = user;
        this.address = address;
        this.orderNumber = orderNumber;
        this.totalAmount = totalAmount;
        this.status = status;
        this.createdAt = createdAt;
    }

    @PrePersist
    public void onCreate() {
        createdAt = LocalDateTime.now();
    }
}