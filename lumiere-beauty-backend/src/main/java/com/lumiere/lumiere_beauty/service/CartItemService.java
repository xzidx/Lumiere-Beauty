package com.lumiere.lumiere_beauty.service;

import java.util.List;

import com.lumiere.lumiere_beauty.model.CartItem;

public interface CartItemService {

    CartItem createCartItem(Long cartId, Long productId, Integer quantity);

    List<CartItem> getAllCartItems();

    CartItem getCartItemById(Long id);

    List<CartItem> getCartItemsByCartId(Long cartId);

}