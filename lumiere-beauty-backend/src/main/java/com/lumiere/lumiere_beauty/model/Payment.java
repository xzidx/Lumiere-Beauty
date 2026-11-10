package com.lumiere.lumiere_beauty.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Foreign Key: order_id
    @OneToOne
    @JoinColumn(name = "order_id", nullable = false, unique = true)
    private Order order;

    @Column(name = "payment_method", nullable = false, length = 30)
    private String paymentMethod;

    @Column(name = "payment_status", nullable = false, length = 30)
    private String paymentStatus;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Column(name = "transaction_reference", length = 100)
    private String transactionReference;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // Default Constructor
    public Payment() {
    }

    // Parameterized Constructor
    public Payment(Order order, String paymentMethod,
                   String paymentStatus, BigDecimal amount,
                   String transactionReference, LocalDateTime createdAt) {
        this.order = order;
        this.paymentMethod = paymentMethod;
        this.paymentStatus = paymentStatus;
        this.amount = amount;
        this.transactionReference = transactionReference;
        this.createdAt = createdAt;
    }

    // Getters and Setters
}