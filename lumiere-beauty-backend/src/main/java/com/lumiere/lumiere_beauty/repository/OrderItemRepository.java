package com.lumiere.lumiere_beauty.repository;

import com.lumiere.lumiere_beauty.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    // All products of one order
    List<OrderItem> findByOrderId(Long orderId);

    @Modifying
    @Query("delete from OrderItem i where i.order.id = :orderId")
    int deleteByOrderId(@Param("orderId") Long orderId);
}