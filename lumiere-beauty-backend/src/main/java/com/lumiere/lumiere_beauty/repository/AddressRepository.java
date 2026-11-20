package com.lumiere.lumiere_beauty.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.lumiere.lumiere_beauty.model.Address;

public interface AddressRepository extends JpaRepository<Address, Long> {

    
}