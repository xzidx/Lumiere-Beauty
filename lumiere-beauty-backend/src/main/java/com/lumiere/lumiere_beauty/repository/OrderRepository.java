package com.lumiere.lumiere_beauty.repository;

import com.lumiere.lumiere_beauty.dto.OrderResponse;
import com.lumiere.lumiere_beauty.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUserId(Long userId);

    // These return plain DTOs, so the Address and User classes are never turned into JSON
    @Query("""
            select new com.lumiere.lumiere_beauty.dto.OrderResponse(
                o.id, o.orderNumber, o.user.id, o.address.id,
                o.totalAmount, o.status, o.createdAt)
            from Order o order by o.id
            """)
    List<OrderResponse> findAllResponses();

    @Query("""
            select new com.lumiere.lumiere_beauty.dto.OrderResponse(
                o.id, o.orderNumber, o.user.id, o.address.id,
                o.totalAmount, o.status, o.createdAt)
            from Order o where o.id = :id
            """)
    Optional<OrderResponse> findResponseById(@Param("id") Long id);

    @Query("""
            select new com.lumiere.lumiere_beauty.dto.OrderResponse(
                o.id, o.orderNumber, o.user.id, o.address.id,
                o.totalAmount, o.status, o.createdAt)
            from Order o where o.user.id = :userId order by o.id
            """)
    List<OrderResponse> findResponsesByUserId(@Param("userId") Long userId);
}