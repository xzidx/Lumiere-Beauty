package com.lumiere.lumiere_beauty.controller;

import com.lumiere.lumiere_beauty.model.Address;
import com.lumiere.lumiere_beauty.service.AddressService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class AddressController {

    private final AddressService addressService;

    public AddressController(AddressService addressService) {
        this.addressService = addressService;
    }

    @GetMapping("/users/{userId}/addresses")
    public List<Address> getByUser(@PathVariable Long userId) {
        return addressService.getByUser(userId);
    }

    @PostMapping("/users/{userId}/addresses")
    @ResponseStatus(HttpStatus.CREATED)
    public Address create(@PathVariable Long userId, @Valid @RequestBody Address address) {
        return addressService.create(userId, address);
    }

    @GetMapping("/addresses/{id}")
    public Address getById(@PathVariable Long id) {
        return addressService.getById(id);
    }

    @PutMapping("/addresses/{id}")
    public Address update(@PathVariable Long id, @Valid @RequestBody Address address) {
        return addressService.update(id, address);
    }

    @DeleteMapping("/addresses/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        addressService.delete(id);
    }
}