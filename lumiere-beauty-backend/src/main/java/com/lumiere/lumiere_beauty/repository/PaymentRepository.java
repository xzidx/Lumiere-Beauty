package com.lumiere.lumiere_beauty.repository;

import com.lumiere.lumiere_beauty.dto.PaymentResponse;
import com.lumiere.lumiere_beauty.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    boolean existsByOrderId(Long orderId);

    // These return plain DTOs, so Payment does not need getters
    @Query("""
            select new com.lumiere.lumiere_beauty.dto.PaymentResponse(
                p.id, p.order.id, p.paymentMethod, p.paymentStatus,
                p.amount, p.transactionReference, p.createdAt)
            from Payment p order by p.id
            """)
    List<PaymentResponse> findAllResponses();

    @Query("""
            select new com.lumiere.lumiere_beauty.dto.PaymentResponse(
                p.id, p.order.id, p.paymentMethod, p.paymentStatus,
                p.amount, p.transactionReference, p.createdAt)
            from Payment p where p.id = :id
            """)
    Optional<PaymentResponse> findResponseById(@Param("id") Long id);

    @Query("""
            select new com.lumiere.lumiere_beauty.dto.PaymentResponse(
                p.id, p.order.id, p.paymentMethod, p.paymentStatus,
                p.amount, p.transactionReference, p.createdAt)
            from Payment p where p.order.id = :orderId
            """)
    Optional<PaymentResponse> findResponseByOrderId(@Param("orderId") Long orderId);

    @Modifying
    @Query("update Payment p set p.paymentStatus = :status where p.id = :id")
    int updateStatus(@Param("id") Long id, @Param("status") String status);

    @Modifying
    @Query("delete from Payment p where p.order.id = :orderId")
    int deleteByOrderId(@Param("orderId") Long orderId);
}