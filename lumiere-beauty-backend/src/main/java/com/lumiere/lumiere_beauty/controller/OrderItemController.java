package com.lumiere.lumiere_beauty.controller;

import com.lumiere.lumiere_beauty.model.OrderItem;
import com.lumiere.lumiere_beauty.service.OrderItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/order-items")
@RequiredArgsConstructor
public class OrderItemController {

    private final OrderItemService orderItemService;

    // Get all order items
    @GetMapping
    public List<OrderItem> getAll() {
        return orderItemService.getAll();
    }

    // Get order item by ID
    @GetMapping("/{id}")
    public OrderItem getById(@PathVariable Long id) {
        return orderItemService.getById(id);
    }

    // Get all products of one order
    @GetMapping("/order/{orderId}")
    public List<OrderItem> getByOrder(@PathVariable Long orderId) {
        return orderItemService.getByOrder(orderId);
    }

    // Delete order item
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        orderItemService.delete(id);
    }
}