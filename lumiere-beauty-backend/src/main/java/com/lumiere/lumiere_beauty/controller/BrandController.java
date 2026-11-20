package com.lumiere.lumiere_beauty.controller;

import com.lumiere.lumiere_beauty.model.Brand;
import com.lumiere.lumiere_beauty.service.BrandService;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
@RequestMapping("/api/brands")
public class BrandController {

    private final BrandService brandService;

    public BrandController(BrandService brandService) {
        this.brandService = brandService;
    }

    @GetMapping
    public List<Brand> getAllBrands() {
        return brandService.getAllBrands();
    }

    @PostMapping 
    public Brand createBrand(@RequestBody Brand brand){
        return brandService.createBrand(brand);
    }
}