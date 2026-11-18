package com.lumiere.lumiere_beauty.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.lumiere.lumiere_beauty.model.CartItem;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    List<CartItem> findByCart_Id(Long cartId);

}