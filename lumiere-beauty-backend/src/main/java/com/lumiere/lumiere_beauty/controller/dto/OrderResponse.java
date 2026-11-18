package com.lumiere.lumiere_beauty.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record OrderResponse(
        Long id,
        String orderNumber,
        Long userId,
        Long addressId,
        BigDecimal totalAmount,
        String status,
        LocalDateTime createdAt
) {
}