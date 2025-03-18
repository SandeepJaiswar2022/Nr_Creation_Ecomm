package com.learning.NrCreation.Service.Product;

import com.learning.NrCreation.Entity.Category;
import com.learning.NrCreation.Entity.Product;
import com.learning.NrCreation.Repository.CategoryRepository;
import com.learning.NrCreation.Repository.ProductRepository;
import com.learning.NrCreation.Request.ProductRequest;
import com.learning.NrCreation.Response.ImageDTO;
import com.learning.NrCreation.Response.ProductDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService{
    private final CategoryRepository categoryRepo;
    private final ProductRepository productRepo;

    @Override
    public Product addProduct(ProductRequest request) {
        // check whether category is found in the DB
        // If Yes, save the new product to DB
        // If No, then save category as a new category
        // Then save the new product to DB.


        Category category = categoryRepo
                .findByName(request.getCategory().getName())
                .orElseGet(()->{
                    Category newCategory =new Category(request.getCategory().getName());
                    return categoryRepo.save(newCategory);
                });

        request.setCategory(category);

        return productRepo.save(createProduct(request));
    }

    private Product createProduct(ProductRequest request) {
        return new Product(
                request.getName(),
                request.getBrand(),
                request.getPrice(),
                request.getInventory(),
                request.getCategory(),
                request.getDescription()
        );
    }


    @Override
    public List<Product> getAllProducts() {
        return productRepo.findAll();
    }

    @Override
    public List<Product> addMultipleProducts(List<ProductRequest> requests) {
        //for every productRequest addProduct
        List<Product> products = new ArrayList<>();
        for(ProductRequest request : requests)
        {
            Category category = categoryRepo
                    .findByName(request.getCategory().getName())
                    .orElseGet(()->{
                        Category newCategory =new Category(request.getCategory().getName());
                        return categoryRepo.save(newCategory);
                    });

            request.setCategory(category);
            products.add(createProduct(request));
        }
        return productRepo.saveAll(products);
    }

    @Override
    @Transactional
    public ProductDTO convertToDto(Product product) {
        List<ImageDTO> imageDTOs = (product.getImages() == null || product.getImages().isEmpty())
                ? Collections.emptyList()
                : product.getImages().stream()
                .map(image -> new ImageDTO(
                        image.getId(),
                        image.getFileName(),
                        image.getDownloadUrl()))
                .collect(Collectors.toList());

        return new ProductDTO(
                product.getId(),
                product.getName(),
                product.getBrand(),
                product.getPrice(),
                product.getInventory(),
                product.getCategory(),
                product.getDescription(),
                imageDTOs
        );
    }

    @Override
    @Transactional
    public List<ProductDTO> getConvertedProducts(List<Product> products) {
        return products.stream().map(this::convertToDto).toList();
    }
}
