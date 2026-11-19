package com.lumiere.lumiere_beauty.repository;
import com.lumiere.lumiere_beauty.model.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AddressRepository extends JpaRepository<Address, Long> {
    // មិនបាច់សរសេរ SQL: Spring បង្កើតឱ្យតាមឈ្មោះ method
    List<Address> findByUserId(Long userId);
}