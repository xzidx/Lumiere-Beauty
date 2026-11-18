package com.lumiere.lumiere_beauty.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.lumiere.lumiere_beauty.model.CartItem;
import com.lumiere.lumiere_beauty.service.CartItemService;

@RestController
@RequestMapping("/api/cart-items")
public class CartItemController {

    private final CartItemService cartItemService;

    public CartItemController(CartItemService cartItemService) {
        this.cartItemService = cartItemService;
    }

    // Create CartItem
    @PostMapping
    public CartItem createCartItem(
            @RequestParam Long cartId,
            @RequestParam Long productId,
            @RequestParam Integer quantity) {

        return cartItemService.createCartItem(
                cartId, productId, quantity);
    }

    // Get all CartItems
    @GetMapping
    public List<CartItem> getAllCartItems() {
        return cartItemService.getAllCartItems();
    }

    // Get CartItem by ID
    @GetMapping("/{id}")
    public CartItem getCartItemById(@PathVariable Long id) {
        return cartItemService.getCartItemById(id);
    }

    // Get CartItems by Cart ID
    @GetMapping("/cart/{cartId}")
    public List<CartItem> getCartItemsByCartId(
            @PathVariable Long cartId) {

        return cartItemService.getCartItemsByCartId(cartId);
    }
}