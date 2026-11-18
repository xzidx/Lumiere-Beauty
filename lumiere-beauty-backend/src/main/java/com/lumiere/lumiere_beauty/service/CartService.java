package com.lumiere.lumiere_beauty.service;

import java.util.List;

import com.lumiere.lumiere_beauty.model.Cart;

public interface CartService {

    Cart createCart(Cart cart);

    List<Cart> getAllCarts();

    Cart getCartById(Long id);

    Cart updateCart(Long id, Cart cart);

    void deleteCart(Long id);
}