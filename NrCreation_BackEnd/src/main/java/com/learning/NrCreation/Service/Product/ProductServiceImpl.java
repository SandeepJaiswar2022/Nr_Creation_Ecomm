package com.learning.NrCreation.Service.Product;

import com.learning.NrCreation.Entity.Category;
import com.learning.NrCreation.Entity.Product;
import com.learning.NrCreation.Exception.ResourceNotFoundException;
import com.learning.NrCreation.Repository.CategoryRepository;
import com.learning.NrCreation.Repository.ProductRepository;
import com.learning.NrCreation.Request.ProductRequest;
import com.learning.NrCreation.Response.ImageDTO;
import com.learning.NrCreation.Response.ProductDTO;
import com.learning.NrCreation.Service.Cloudinary.CloudinaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService{
    private final CategoryRepository categoryRepo;
    private final ProductRepository productRepo;
    private final CloudinaryService cloudinaryService;

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
                request.getSize(),
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

        return new ProductDTO(
                product.getId(),
                product.getName(),
                product.getBrand(),
                product.getPrice(),
                product.getInventory(),
                product.getSize(),
                product.getCategory(),
                product.getDescription(),
                product.getImageUrls()
        );
    }

    @Override
    @Transactional
    public List<ProductDTO> getConvertedProducts(List<Product> products) {
        return products.stream().map(this::convertToDto).toList();
    }

    @Override
    public Product getProductById(Long productId) {
        return productRepo.findById(productId).orElseThrow(()->new ResourceNotFoundException("Product not found"));
    }

    @Override
    public List<String> addImagesToProduct(Long productId, List<MultipartFile> images) throws IOException {
        Product product = getProductById(productId);
        List<String> imageUrls = new ArrayList<>();
        for (MultipartFile image : images) {
            String imageUrl = cloudinaryService.uploadImage(image);
            imageUrls.add(imageUrl);
        }
        product.setImageUrls(imageUrls);
        productRepo.save(product);

        return product.getImageUrls();
    }


    public void deleteProductImage(Long productId, String url) throws IOException {
        Product product = getProductById(productId);
        if(product.getImageUrls().contains(url))
        {
            product.getImageUrls().remove(url);
        }
        else
        {
            throw new ResourceNotFoundException("Product Image not found or already deleted");
        }
        cloudinaryService.deleteImage(url);
        productRepo.save(product);
    }

    @Override
    public void deleteProduct(Long productId) throws IOException {
        Product product = getProductById(productId);
        for(String imageUrl : product.getImageUrls())
        {
            product.getImageUrls().remove(imageUrl);
            cloudinaryService.deleteImage(imageUrl);
        }
        productRepo.delete(product);
    }

    @Override
    public Product updateProduct(Long productId, ProductRequest request) {
        Product product = getProductById(productId);
        product.setName(request.getName());
        product.setBrand(request.getBrand());
        product.setPrice(request.getPrice());
        product.setInventory(request.getInventory());
        product.setSize(request.getSize());
        product.setCategory(request.getCategory());
        product.setDescription(request.getDescription());

        return productRepo.save(product);
    }
}
