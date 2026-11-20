
package com.lumiere.lumiere_beauty.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.*;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Entity
@Table(name = "orders")
@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relationship with User
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private User user;

    // Relationship with Address
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "address_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Address address;

    // Foreign key values for JSON response
    @Column(name = "user_id", insertable = false, updatable = false)
    private Long userId;

    @Column(name = "address_id", insertable = false, updatable = false)
    private Long addressId;

    // Order information
    @Column(name = "order_number", unique = true, length = 50)
    private String orderNumber;

    @Column(
        name = "total_amount",
        nullable = false,
        precision = 10,
        scale = 2
    )
    private BigDecimal totalAmount;

    @Column(nullable = false, length = 30)
    private String status;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // Checkout information (not database columns)
    @Transient
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String paymentMethod;

    // Receive order items from frontend
    @Transient
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private List<OrderItem> items;

    // Shipping information
    @Transient
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private Map<String, String> shipping;

    public Order() {
    }

    public Order(
        User user,
        Address address,
        String orderNumber,
        BigDecimal totalAmount,
        String status,
        LocalDateTime createdAt
    ) {
        this.user = user;
        this.address = address;
        this.orderNumber = orderNumber;
        this.totalAmount = totalAmount;
        this.status = status;
        this.createdAt = createdAt;
    }

    @PrePersist
    public void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}
