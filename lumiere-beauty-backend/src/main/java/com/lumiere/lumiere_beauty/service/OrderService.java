package com.lumiere.lumiere_beauty.service;

import com.lumiere.lumiere_beauty.dto.OrderRequest;
import com.lumiere.lumiere_beauty.dto.OrderResponse;
import com.lumiere.lumiere_beauty.model.Address;
import com.lumiere.lumiere_beauty.model.Order;
import com.lumiere.lumiere_beauty.model.Payment;
import com.lumiere.lumiere_beauty.model.User;
import com.lumiere.lumiere_beauty.repository.OrderRepository;
import com.lumiere.lumiere_beauty.repository.PaymentRepository;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;
    private final EntityManager entityManager;

    public List<OrderResponse> getAll() {
        return orderRepository.findAllResponses();
    }

    public OrderResponse getById(Long id) {
        return orderRepository.findResponseById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));
    }

    public List<OrderResponse> getByUser(Long userId) {
        return orderRepository.findResponsesByUserId(userId);
    }

    @Transactional
    public OrderResponse create(OrderRequest request) {
        if (request.userId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "userId is required");
        }
        if (request.addressId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "addressId is required");
        }
        if (request.totalAmount() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "totalAmount is required");
        }

        User user = entityManager.find(User.class, request.userId());
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }
        Address address = entityManager.find(Address.class, request.addressId());
        if (address == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Address not found");
        }

        Order order = new Order();
        order.setUser(user);
        order.setAddress(address);
        order.setOrderNumber("ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        order.setTotalAmount(request.totalAmount());
        order.setStatus(request.status() == null ? "PENDING" : request.status());

        Order saved = orderRepository.save(order);

        // If a paymentMethod was sent, create the payment together with the order
        if (request.paymentMethod() != null && !request.paymentMethod().isBlank()) {
            paymentRepository.save(new Payment(
                    saved,
                    request.paymentMethod(),
                    "PENDING",
                    saved.getTotalAmount(),
                    "TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase(),
                    LocalDateTime.now()));
        }

        return new OrderResponse(
                saved.getId(),
                saved.getOrderNumber(),
                request.userId(),
                request.addressId(),
                saved.getTotalAmount(),
                saved.getStatus(),
                saved.getCreatedAt());
    }

    @Transactional
    public OrderResponse update(Long id, OrderRequest request) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));

        if (request.userId() != null) {
            User user = entityManager.find(User.class, request.userId());
            if (user == null) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
            }
            order.setUser(user);
        }
        if (request.addressId() != null) {
            Address address = entityManager.find(Address.class, request.addressId());
            if (address == null) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Address not found");
            }
            order.setAddress(address);
        }
        if (request.totalAmount() != null) {
            order.setTotalAmount(request.totalAmount());
        }
        if (request.status() != null) {
            order.setStatus(request.status());
        }

        orderRepository.saveAndFlush(order);
        return getById(id);
    }

    @Transactional
    public OrderResponse updateStatus(Long id, String status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));
        order.setStatus(status);
        orderRepository.save(order);
        return getById(id);
    }

    @Transactional
    public void delete(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));
        // An order's payment must be removed first, otherwise the database blocks the delete
        paymentRepository.deleteByOrderId(id);
        orderRepository.delete(order);
    }
}