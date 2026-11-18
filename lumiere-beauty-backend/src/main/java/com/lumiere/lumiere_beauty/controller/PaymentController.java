
package com.lumiere.lumiere_beauty.controller;

import com.lumiere.lumiere_beauty.dto.PaymentRequest;
import com.lumiere.lumiere_beauty.dto.PaymentResponse;
import com.lumiere.lumiere_beauty.service.PaymentService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    // Get all payments
    @GetMapping
    public List<PaymentResponse> getAll() {
        return paymentService.getAll();
    }

    // Get payment by ID
    @GetMapping("/{id}")
    public PaymentResponse getById(@PathVariable Long id) {
        return paymentService.getById(id);
    }

    // Get payment by Order ID
    @GetMapping("/order/{orderId}")
    public PaymentResponse getByOrder(
            @PathVariable Long orderId) {
        return paymentService.getByOrder(orderId);
    }

    // Create payment
    @PostMapping
    public PaymentResponse create(
        @RequestBody PaymentRequest request) {
    return paymentService.create(request);
}

    // Update payment status
    @PutMapping("/{id}/status")
    public PaymentResponse updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        return paymentService.updateStatus(
                id, body.get("status"));
    }

    // Delete payment
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        paymentService.delete(id);
    }
}
