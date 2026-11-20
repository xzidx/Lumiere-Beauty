
package com.lumiere.lumiere_beauty.controller;

import com.lumiere.lumiere_beauty.model.Address;
import com.lumiere.lumiere_beauty.service.AddressService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/addresses")
public class AddressController {

    private final AddressService addressService;

    public AddressController(AddressService addressService) {
        this.addressService = addressService;
    }

    @GetMapping("/user/{userId}")
    public List<Address> getUserAddresses(@PathVariable Long userId) {
        return addressService.getUserAddresses(userId);
    }

    @PostMapping("/user/{userId}")
    public Address createAddress(
            @PathVariable Long userId,
            @RequestBody Address address) {

        return addressService.createAddress(userId, address);
    }

    @PutMapping("/{addressId}/user/{userId}")
    public Address updateAddress(
            @PathVariable Long addressId,
            @PathVariable Long userId,
            @RequestBody Address address) {

        return addressService.updateAddress(
            addressId, userId, address
        );
    }

    @DeleteMapping("/{addressId}/user/{userId}")
    public void deleteAddress(
            @PathVariable Long addressId,
            @PathVariable Long userId) {

        addressService.deleteAddress(addressId, userId);
    }
}
