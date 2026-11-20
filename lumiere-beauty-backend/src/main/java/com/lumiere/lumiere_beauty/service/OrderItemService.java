package com.lumiere.lumiere_beauty.service;

import com.lumiere.lumiere_beauty.model.OrderItem;
import com.lumiere.lumiere_beauty.repository.OrderItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderItemService {

    private final OrderItemRepository orderItemRepository;

    public List<OrderItem> getAll() {
        return orderItemRepository.findAll(Sort.by("id"));
    }

    public OrderItem getById(Long id) {
        return orderItemRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order item not found"));
    }

    public List<OrderItem> getByOrder(Long orderId) {
        return orderItemRepository.findByOrderId(orderId);
    }

    public void delete(Long id) {
        if (!orderItemRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Order item not found");
        }
        orderItemRepository.deleteById(id);
    }
}