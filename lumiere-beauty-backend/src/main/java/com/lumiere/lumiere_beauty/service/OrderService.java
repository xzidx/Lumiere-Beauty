
package com.lumiere.lumiere_beauty.service;

import com.lumiere.lumiere_beauty.model.Address;
import com.lumiere.lumiere_beauty.model.Order;
import com.lumiere.lumiere_beauty.model.OrderItem;
import com.lumiere.lumiere_beauty.model.Payment;
import com.lumiere.lumiere_beauty.model.Product;
import com.lumiere.lumiere_beauty.model.User;

import com.lumiere.lumiere_beauty.repository.OrderItemRepository;
import com.lumiere.lumiere_beauty.repository.OrderRepository;
import com.lumiere.lumiere_beauty.repository.PaymentRepository;

import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;
    private final OrderItemRepository orderItemRepository;
    private final EntityManager entityManager;

    // GET ALL ORDERS
    public List<Order> getAll() {
        return orderRepository.findAll(Sort.by("id"));
    }

    // GET ORDER BY ID
    public Order getById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Order not found with ID: " + id
                ));
    }

    // GET ORDERS BY USER ID
    public List<Order> getByUser(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    // CREATE ORDER
    @Transactional
    public Order create(Order request) {

        // 1. GET USER ID
        Long userId = request.getUser() != null
                ? request.getUser().getId()
                : request.getUserId();

        if (userId == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "User ID is required"
            );
        }

        // 2. GET ADDRESS ID
        // Use addressId directly because Address has no getId().
        Long addressId = request.getAddressId();

        if (addressId == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Address ID is required"
            );
        }

        // 3. VALIDATE ORDER ITEMS
        if (request.getItems() == null ||
                request.getItems().isEmpty()) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Order items are required"
            );
        }

        for (OrderItem item : request.getItems()) {

            if (item == null || item.getProductId() == null) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Product ID is required"
                );
            }

            if (item.getQuantity() == null ||
                    item.getQuantity() < 1) {

                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Quantity must be at least 1"
                );
            }
        }

        // 4. FIND USER
        User user = entityManager.find(User.class, userId);

        if (user == null) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "User not found with ID: " + userId
            );
        }

        // 5. FIND ADDRESS
        Address address = entityManager.find(
                Address.class,
                addressId
        );

        if (address == null) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Address not found with ID: " + addressId
            );
        }

        // CHECK ADDRESS OWNERSHIP USING JPQL
        List<Long> addressOwners = entityManager.createQuery(
                "SELECT a.user.id FROM Address a WHERE a.id = :addressId",
                Long.class
        )
        .setParameter("addressId", addressId)
        .getResultList();

        if (addressOwners.isEmpty() ||
                !userId.equals(addressOwners.get(0))) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "This address does not belong to this user"
            );
        }

        // 6. CALCULATE ORDER ITEMS AND TOTAL
        List<OrderItem> items = new ArrayList<>();

        BigDecimal totalAmount = BigDecimal.ZERO;

        for (OrderItem item : request.getItems()) {

            Long productId = item.getProductId();

            // GET PRODUCT INFORMATION DIRECTLY FROM DATABASE
            List<Object[]> productRows = entityManager.createQuery(
                    "SELECT p.price, p.stockQuantity, p.name " +
                    "FROM Product p WHERE p.id = :productId",
                    Object[].class
            )
            .setParameter("productId", productId)
            .getResultList();

            if (productRows.isEmpty()) {
                throw new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Product not found with ID: " + productId
                );
            }

            Object[] productData = productRows.get(0);

            BigDecimal unitPrice = (BigDecimal) productData[0];
            Integer stockQuantity = (Integer) productData[1];
            String productName = (String) productData[2];

            // CHECK STOCK
            if (stockQuantity == null ||
                    stockQuantity < item.getQuantity()) {

                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Not enough stock for product: " + productName
                );
            }

            // VALIDATE PRICE
            if (unitPrice == null ||
                    unitPrice.compareTo(BigDecimal.ZERO) < 0) {

                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Invalid product price for product ID: " + productId
                );
            }

            // GET PRODUCT REFERENCE
            Product product = entityManager.getReference(
                    Product.class,
                    productId
            );

            // CALCULATE SUBTOTAL
            BigDecimal subtotal = unitPrice.multiply(
                    BigDecimal.valueOf(item.getQuantity())
            );

            // CALCULATE TOTAL
            totalAmount = totalAmount.add(subtotal);

            // CREATE ORDER ITEM
            OrderItem orderItem = new OrderItem();

            orderItem.setProduct(product);
            orderItem.setQuantity(item.getQuantity());
            orderItem.setUnitPrice(unitPrice);
            orderItem.setSubtotal(subtotal);

            items.add(orderItem);
        }

        // 7. CREATE ORDER
        Order order = new Order();

        order.setUser(user);
        order.setAddress(address);

        order.setOrderNumber(
                "ORD-" + UUID.randomUUID()
                        .toString()
                        .substring(0, 8)
                        .toUpperCase()
        );

        order.setTotalAmount(totalAmount);
        order.setStatus("PENDING");
        order.setCreatedAt(LocalDateTime.now());

        // 8. SAVE ORDER
        Order savedOrder = orderRepository.saveAndFlush(order);

        // 9. SAVE ORDER ITEMS
        for (OrderItem item : items) {
            item.setOrder(savedOrder);
        }

        List<OrderItem> savedItems =
                orderItemRepository.saveAll(items);

        savedOrder.setItems(savedItems);

        // 10. CREATE PAYMENT
        String paymentMethod = request.getPaymentMethod();

        if (paymentMethod != null && !paymentMethod.isBlank()) {

            Payment payment = new Payment();

            payment.setOrder(savedOrder);
            payment.setPaymentMethod(paymentMethod);
            payment.setPaymentStatus("PENDING");
            payment.setAmount(totalAmount);

            payment.setTransactionReference(
                    "TXN-" + UUID.randomUUID()
                            .toString()
                            .substring(0, 8)
                            .toUpperCase()
            );

            payment.setCreatedAt(LocalDateTime.now());

            paymentRepository.save(payment);
        }

        return savedOrder;
    }

    // UPDATE ORDER
    @Transactional
    public Order update(Long id, Order request) {

        Order order = getById(id);

        // UPDATE USER
        Long userId = request.getUser() != null
                ? request.getUser().getId()
                : request.getUserId();

        if (userId != null) {

            User user = entityManager.find(User.class, userId);

            if (user == null) {
                throw new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "User not found with ID: " + userId
                );
            }

            order.setUser(user);
        }

        // UPDATE ADDRESS
        Long addressId = request.getAddressId();

        if (addressId != null) {

            Address address = entityManager.find(
                    Address.class,
                    addressId
            );

            if (address == null) {
                throw new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Address not found with ID: " + addressId
                );
            }

            // GET CURRENT USER ID
            Long currentUserId = userId != null
                    ? userId
                    : order.getUser().getId();

            // CHECK ADDRESS OWNERSHIP USING JPQL
            List<Long> addressOwners = entityManager.createQuery(
                    "SELECT a.user.id FROM Address a WHERE a.id = :addressId",
                    Long.class
            )
            .setParameter("addressId", addressId)
            .getResultList();

            if (addressOwners.isEmpty() ||
                    !currentUserId.equals(addressOwners.get(0))) {

                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "This address does not belong to this user"
                );
            }

            order.setAddress(address);
        }

        // UPDATE STATUS
        if (request.getStatus() != null &&
                !request.getStatus().isBlank()) {

            order.setStatus(request.getStatus());
        }

        // TOTAL AMOUNT IS CALCULATED BY BACKEND
        return orderRepository.saveAndFlush(order);
    }

    // UPDATE ORDER STATUS
    @Transactional
    public Order updateStatus(Long id, String status) {

        if (status == null || status.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Status is required"
            );
        }

        Order order = getById(id);

        order.setStatus(status);

        return orderRepository.save(order);
    }

    // DELETE ORDER
    @Transactional
    public void delete(Long id) {

        Order order = getById(id);

        // DELETE ORDER ITEMS FIRST
        orderItemRepository.deleteByOrderId(id);

        // DELETE PAYMENT
        paymentRepository.deleteByOrderId(id);

        // DELETE ORDER
        orderRepository.delete(order);
    }
}
