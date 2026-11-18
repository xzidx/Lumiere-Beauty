package com.lumiere.lumiere_beauty.service;

import com.lumiere.lumiere_beauty.dto.PaymentRequest;
import com.lumiere.lumiere_beauty.dto.PaymentResponse;
import com.lumiere.lumiere_beauty.model.Order;
import com.lumiere.lumiere_beauty.model.Payment;
import com.lumiere.lumiere_beauty.repository.OrderRepository;
import com.lumiere.lumiere_beauty.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
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

    public List<PaymentResponse> getAll() {
        return paymentRepository.findAllResponses();
    }

    public PaymentResponse getById(Long id) {
        return paymentRepository.findResponseById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Payment not found"));
    }

    public PaymentResponse getByOrder(Long orderId) {
        return paymentRepository.findResponseByOrderId(orderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Payment not found for this order"));
    }

    @Transactional
    public PaymentResponse create(PaymentRequest request) {
        if (request.orderId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "orderId is required");
        }
        if (request.paymentMethod() == null || request.paymentMethod().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "paymentMethod is required");
        }

        Order order = orderRepository.findById(request.orderId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));

        if (paymentRepository.existsByOrderId(request.orderId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "This order already has a payment");
        }

        // If no amount is sent, use the order total
        BigDecimal amount = request.amount() != null ? request.amount() : order.getTotalAmount();
        String status = request.paymentStatus() != null ? request.paymentStatus() : "PENDING";
        String reference = request.transactionReference() != null
                ? request.transactionReference()
                : "TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        paymentRepository.save(new Payment(
                order,
                request.paymentMethod(),
                status,
                amount,
                reference,
                LocalDateTime.now()));

        return getByOrder(request.orderId());
    }

    @Transactional
    public PaymentResponse updateStatus(Long id, String status) {
        if (status == null || status.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "status is required");
        }

        PaymentResponse current = getById(id);
        paymentRepository.updateStatus(id, status);

        // When a payment is PAID, mark its order as PAID too
        if ("PAID".equalsIgnoreCase(status)) {
            Order order = orderRepository.findById(current.orderId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));
            order.setStatus("PAID");
            orderRepository.save(order);
        }

        return getById(id);
    }

    public void delete(Long id) {
        if (!paymentRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Payment not found");
        }
        paymentRepository.deleteById(id);
    }
}