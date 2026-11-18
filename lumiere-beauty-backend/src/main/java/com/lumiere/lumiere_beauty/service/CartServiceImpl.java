package com.lumiere.lumiere_beauty.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.lumiere.lumiere_beauty.model.Cart;
import com.lumiere.lumiere_beauty.repository.CartRepository;

@Service
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;

    public CartServiceImpl(CartRepository cartRepository) {
        this.cartRepository = cartRepository;
    }

    @Override
    public Cart createCart(Cart cart) {
        return cartRepository.save(cart);
    }

    @Override
    public List<Cart> getAllCarts() {
        return cartRepository.findAll();
    }

    @Override
    public Cart getCartById(Long id) {
        return cartRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cart not found"));
    }

    @Override
    public Cart updateCart(Long id, Cart cart) {
        Cart existingCart = getCartById(id);

        existingCart.setUser(cart.getUser());

        return cartRepository.save(existingCart);
    }

    @Override
    public void deleteCart(Long id) {
        Cart existingCart = getCartById(id);
        cartRepository.delete(existingCart);
    }
}