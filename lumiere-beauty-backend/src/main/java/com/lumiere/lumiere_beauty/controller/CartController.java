package com.lumiere.lumiere_beauty.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lumiere.lumiere_beauty.model.Cart;
import com.lumiere.lumiere_beauty.service.CartService;

@RestController
@RequestMapping("/api/carts")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    // POST - Create Cart
    @PostMapping
    public Cart createCart(@RequestBody Cart cart) {
        return cartService.createCart(cart);
    }

    // GET - Get All Carts
    @GetMapping
    public List<Cart> getAllCarts() {
        return cartService.getAllCarts();
    }

    // GET - Get Cart By ID
    @GetMapping("/{id}")
    public Cart getCartById(@PathVariable Long id) {
        return cartService.getCartById(id);
    }

    // PUT - Update Cart
    @PutMapping("/{id}")
    public Cart updateCart(@PathVariable Long id, @RequestBody Cart cart) {
        return cartService.updateCart(id, cart);
    }

    // DELETE - Delete Cart
    @DeleteMapping("/{id}")
    public String deleteCart(@PathVariable Long id) {
        cartService.deleteCart(id);
        return "Cart deleted successfully";
    }
}