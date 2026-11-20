
package com.lumiere.lumiere_beauty.service;

import com.lumiere.lumiere_beauty.model.Product;
import com.lumiere.lumiere_beauty.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    // Create product
    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    // Get all products
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // Update product
    public Product updateProduct(Long id, Product product) {
        Product existing = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        product.setId(id);

        return productRepository.save(product);
    }

    // Delete product
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }
}
