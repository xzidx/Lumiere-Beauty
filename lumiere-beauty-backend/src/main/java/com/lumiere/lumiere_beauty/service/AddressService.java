
package com.lumiere.lumiere_beauty.service;

import com.lumiere.lumiere_beauty.model.Address;
import com.lumiere.lumiere_beauty.model.User;
import com.lumiere.lumiere_beauty.repository.AddressRepository;
import com.lumiere.lumiere_beauty.repository.UserRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    public AddressService(
            AddressRepository addressRepository,
            UserRepository userRepository) {

        this.addressRepository = addressRepository;
        this.userRepository = userRepository;
    }

    public List<Address> getUserAddresses(Long userId) {

        if (!userRepository.existsById(userId)) {
            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND, "User not found"
            );
        }

        return addressRepository.findByUser_Id(userId);
    }

    public Address createAddress(Long userId, Address address) {

        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "User not found"
            ));

        address.setUser(user);

        return addressRepository.save(address);
    }

    public Address updateAddress(
            Long addressId,
            Long userId,
            Address updatedAddress) {

        Address address = addressRepository
            .findByIdAndUser_Id(addressId, userId)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Address not found"
            ));

        address.setRecipientName(updatedAddress.getRecipientName());
        address.setPhone(updatedAddress.getPhone());
        address.setAddress(updatedAddress.getAddress());
        address.setCity(updatedAddress.getCity());

        return addressRepository.save(address);
    }

    public void deleteAddress(Long addressId, Long userId) {

        Address address = addressRepository
            .findByIdAndUser_Id(addressId, userId)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Address not found"
            ));

        addressRepository.delete(address);
    }
}
