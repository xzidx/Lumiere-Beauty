package com.lumiere.lumiere_beauty.service;

import com.lumiere.lumiere_beauty.model.Order;
import com.lumiere.lumiere_beauty.model.Payment;
import com.lumiere.lumiere_beauty.repository.OrderRepository;
import com.lumiere.lumiere_beauty.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;

    public List<Payment> getAll() {
        return paymentRepository.findAll(Sort.by("id"));
    }

    public Payment getById(Long id) {
        return paymentRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Payment not found"));
    }

    public Payment getByOrder(Long orderId) {
        return paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Payment not found for this order"));
    }

    @Transactional
    public Payment create(Payment request) {
        if (request.getOrderId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "orderId is required");
        }
        if (request.getPaymentMethod() == null || request.getPaymentMethod().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "paymentMethod is required");
        }

        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));

        if (paymentRepository.existsByOrderId(request.getOrderId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "This order already has a payment");
        }

        // If no amount is sent, use the order total
        BigDecimal amount = request.getAmount() != null ? request.getAmount() : order.getTotalAmount();
        String status = request.getPaymentStatus() != null ? request.getPaymentStatus() : "PENDING";
        String reference = request.getTransactionReference() != null
                ? request.getTransactionReference()
                : "TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        Payment payment = new Payment(
                order,
                request.getPaymentMethod(),
                status,
                amount,
                reference,
                LocalDateTime.now());
        // Read-only column, so fill it in memory for the response
        payment.setOrderId(order.getId());

        return paymentRepository.save(payment);
    }

    @Transactional
    public Payment updateStatus(Long id, String status) {
        if (status == null || status.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "status is required");
        }

        Payment payment = getById(id);
        payment.setPaymentStatus(status);
        paymentRepository.save(payment);

        // When a payment is PAID, mark its order as PAID too
        if ("PAID".equalsIgnoreCase(status)) {
            Order order = orderRepository.findById(payment.getOrderId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));
            order.setStatus("PAID");
            orderRepository.save(order);
        }

        return payment;
    }

    public void delete(Long id) {
        if (!paymentRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Payment not found");
        }
        paymentRepository.deleteById(id);
    }
}