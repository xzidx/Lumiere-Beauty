package com.lumiere.lumiere_beauty.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record PaymentResponse(
        Long id,
        Long orderId,
        String paymentMethod,
        String paymentStatus,
        BigDecimal amount,
        String transactionReference,
        LocalDateTime createdAt
) {
}