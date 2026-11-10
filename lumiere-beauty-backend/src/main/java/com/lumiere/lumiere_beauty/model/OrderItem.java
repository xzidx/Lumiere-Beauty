package com.lumiere.lumiere_beauty.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "order_items")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Foreign Key: order_id
    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    // Foreign Key: product_id
    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false)
    private Integer quantity;

    @Column(name = "unit_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal unitPrice;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal subtotal;

    // Default Constructor
    public OrderItem() {
    }

    // Parameterized Constructor
    public OrderItem(Order order, Product product, Integer quantity,
                     BigDecimal unitPrice, BigDecimal subtotal) {
        this.order = order;
        this.product = product;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.subtotal = subtotal;
    }

    // Getters and Setters
}