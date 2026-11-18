package com.lumiere.lumiere_beauty.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.lumiere.lumiere_beauty.model.Cart;

public interface CartRepository extends JpaRepository<Cart, Long> {

}