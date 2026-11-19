package com.lumiere.lumiere_beauty.service;

import com.lumiere.lumiere_beauty.model.Address;
import com.lumiere.lumiere_beauty.model.User;
import com.lumiere.lumiere_beauty.repository.AddressRepository;
import com.lumiere.lumiere_beauty.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    public AddressService(AddressRepository addressRepository, UserRepository userRepository) {
        this.addressRepository = addressRepository;
        this.userRepository = userRepository;
    }

    public List<Address> getByUser(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }
        return addressRepository.findByUserId(userId);
    }

    public Address getById(Long id) {
        return addressRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Address not found"));
    }

    @Transactional
    public Address create(Long userId, Address address) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        if (address.isDefaultAddress()) {
            clearDefault(userId);
        }
        address.setId(null);
        address.setUser(user);
        return addressRepository.save(address);
    }

    @Transactional
    public Address update(Long id, Address data) {
        Address existing = getById(id);

        if (data.isDefaultAddress()) {
            clearDefault(existing.getUser().getId());
        }
        existing.setStreet(data.getStreet());
        existing.setCity(data.getCity());
        existing.setState(data.getState());
        existing.setPostalCode(data.getPostalCode());
        existing.setCountry(data.getCountry());
        existing.setDefaultAddress(data.isDefaultAddress());
        return addressRepository.save(existing);
    }

    public void delete(Long id) {
        if (!addressRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Address not found");
        }
        addressRepository.deleteById(id);
    }

    private void clearDefault(Long userId) {
        List<Address> list = addressRepository.findByUserId(userId);
        list.forEach(a -> a.setDefaultAddress(false));
        addressRepository.saveAll(list);
    }
}