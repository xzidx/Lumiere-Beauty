package com.lumiere.lumiere_beauty.repository;

import com.lumiere.lumiere_beauty.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {

}