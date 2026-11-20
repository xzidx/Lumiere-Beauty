package com.lumiere.lumiere_beauty.service;
import com.lumiere.lumiere_beauty.model.Address;
import org.springframework.stereotype.Service;
import com.lumiere.lumiere_beauty.repository.AddressRepository;
import java.util.List;
@Service
public class AddressService {
    private final AddressRepository addressRepository;

    public AddressService (AddressRepository addressRepository) {
        this.addressRepository = addressRepository ;
    }

    public Address createAddress(Address address) {
        return this.addressRepository.save(address);
    }

    public List<Address> getAllAddresses() {
        return addressRepository.findAll();
    }
}
