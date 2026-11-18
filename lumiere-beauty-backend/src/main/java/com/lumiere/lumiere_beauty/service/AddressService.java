package com.lumiere.lumiere_beauty.service;
import com.lumiere.lumiere_beauty.model.Address;

import com.lumiere.lumiere_beauty.repository.AddressRepository;


public class AddressService {
    private final AddressRepository addressRepository;

    public AddressService (AddressRepository addressRepository) {
        this.addressRepository = addressRepository ;
    }

    public Address creatAddressL(Address address) {
        return this.addressRepository.save(address);
    }
}
