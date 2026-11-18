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

    // Create Address
    @PostMapping
    public Address createAddress(@RequestBody Address address) {
        return addressService.createAddress(address);
    }

    // Get All Addresses
    @GetMapping
    public List<Address> getAllAddresses() {
        return addressService.getAllAddresses();
    }
//     @GetMapping("/test")
// public Address testAddress() {

//     Address address = new Address();

//     address.setId(1L);
//     address.setRecipientName("Chan Samnang");
//     address.setPhone("012345678");
//     address.setAddress("Street 123, Phnom Penh");
//     address.setCity("Phnom Penh");

//     return address;
// }
}