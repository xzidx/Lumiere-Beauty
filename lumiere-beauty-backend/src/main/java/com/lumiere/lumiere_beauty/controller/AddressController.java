package com.lumiere.lumiere_beauty.controller;

import com.lumiere.lumiere_beauty.model.Address;
import com.lumiere.lumiere_beauty.service.AddressService;

import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")@RestController
@RequestMapping("/api/addresses")

public class AddressController {
    
    private final AddressService addressService;

    public AddressController(AddressService addressService) {
        this.addressService = addressService;
    }
    
    // Create the adresss
    @PostMapping 
    public Address creatAddress(@RequestBody Address address) {
        return addressService.creatAddress(address);
    }
}
