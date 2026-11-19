package com.lumiere.lumiere_beauty.service;

import com.lumiere.lumiere_beauty.model.Brand;
import com.lumiere.lumiere_beauty.repository.BrandRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BrandService {

    public Brand createBrand(Brand brand) {
    return brandRepository.save(brand);
}

    private final BrandRepository brandRepository;

    public BrandService(BrandRepository brandRepository) {
        this.brandRepository = brandRepository;
    }

    public List<Brand> getAllBrands() {
        return brandRepository.findAll();
    }
}