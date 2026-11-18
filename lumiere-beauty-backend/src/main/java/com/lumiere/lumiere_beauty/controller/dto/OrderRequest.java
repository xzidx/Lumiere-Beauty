package com.lumiere.lumiere_beauty.dto;

import java.math.BigDecimal;

public record OrderRequest(
        Long userId,
        Long addressId,
        BigDecimal totalAmount,
        String status,
        String paymentMethod   // optional: if sent, a payment is created together with the order
) {
}