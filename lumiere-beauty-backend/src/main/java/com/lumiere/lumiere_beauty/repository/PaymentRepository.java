package com.lumiere.lumiere_beauty.repository;

import com.lumiere.lumiere_beauty.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    boolean existsByOrderId(Long orderId);

    Optional<Payment> findByOrderId(Long orderId);

    @Modifying
    @Query("delete from Payment p where p.order.id = :orderId")
    int deleteByOrderId(@Param("orderId") Long orderId);
}