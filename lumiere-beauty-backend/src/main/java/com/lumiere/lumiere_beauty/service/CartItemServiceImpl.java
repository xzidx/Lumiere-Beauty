package com.lumiere.lumiere_beauty.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.lumiere.lumiere_beauty.model.Cart;
import com.lumiere.lumiere_beauty.model.CartItem;
import com.lumiere.lumiere_beauty.repository.CartItemRepository;
import com.lumiere.lumiere_beauty.repository.CartRepository;

@Service
public class CartItemServiceImpl implements CartItemService {

    private final CartItemRepository cartItemRepository;
    private final CartRepository cartRepository;

    public CartItemServiceImpl(
            CartItemRepository cartItemRepository,
            CartRepository cartRepository) {

        this.cartItemRepository = cartItemRepository;
        this.cartRepository = cartRepository;
    }

    @Override
    public CartItem createCartItem(
            Long cartId, Long productId, Integer quantity) {

        if (quantity == null || quantity <= 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Quantity must be greater than zero");
        }

        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Cart not found"));

        CartItem cartItem = new CartItem(cart, quantity);

        return cartItemRepository.save(cartItem);
    }

    @Override
    public List<CartItem> getAllCartItems() {
        return cartItemRepository.findAll();
    }

    @Override
    public CartItem getCartItemById(Long id) {
        return cartItemRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "CartItem not found"));
    }

    @Override
    public List<CartItem> getCartItemsByCartId(Long cartId) {

        if (!cartRepository.existsById(cartId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Cart not found");
        }

        return cartItemRepository.findByCart_Id(cartId);
    }
}