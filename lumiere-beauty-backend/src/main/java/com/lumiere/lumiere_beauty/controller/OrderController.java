
package com.lumiere.lumiere_beauty.controller;

import com.lumiere.lumiere_beauty.model.Order;
import com.lumiere.lumiere_beauty.service.OrderService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    // GET ALL ORDERS
    @GetMapping
    public ResponseEntity<List<Order>> getAll() {
        return ResponseEntity.ok(orderService.getAll());
    }

    // GET ORDER BY ID
    @GetMapping("/{id}")
    public ResponseEntity<Order> getById(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getById(id));
    }

    // GET ORDERS BY USER ID
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Order>> getByUser(
            @PathVariable Long userId) {

        return ResponseEntity.ok(orderService.getByUser(userId));
    }

    // CREATE ORDER
    @PostMapping
    public ResponseEntity<Order> create(
            @RequestBody Order request) {

        Order savedOrder = orderService.create(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedOrder);
    }

    // UPDATE ORDER
    @PutMapping("/{id}")
    public ResponseEntity<Order> update(
            @PathVariable Long id,
            @RequestBody Order request) {

        return ResponseEntity.ok(
                orderService.update(id, request)
        );
    }

    // UPDATE ORDER STATUS
    @PutMapping("/{id}/status")
    public ResponseEntity<Order> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {

        String status = body.get("status");

        if (status == null || status.isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.ok(
                orderService.updateStatus(id, status)
        );
    }

    // DELETE ORDER
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long id) {

        orderService.delete(id);

        return ResponseEntity.noContent().build();
    }
}
