package com.lumiere.lumiere_beauty.dto;

import java.math.BigDecimal;

public record PaymentRequest(
        Long orderId,
        String paymentMethod,
        BigDecimal amount,
        String transactionReference,
        String paymentStatus
) {
}