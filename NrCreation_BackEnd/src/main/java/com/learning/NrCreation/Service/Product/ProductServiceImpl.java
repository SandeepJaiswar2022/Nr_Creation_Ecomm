package com.learning.NrCreation.Service.Product;

import com.learning.NrCreation.Entity.Category;
import com.learning.NrCreation.Entity.Product;
import com.learning.NrCreation.Exception.ResourceNotFoundException;
import com.learning.NrCreation.Repository.CategoryRepository;
import com.learning.NrCreation.Repository.ProductRepository;
import com.learning.NrCreation.Request.ProductRequest;
import com.learning.NrCreation.Response.ProductDTO;
import com.learning.NrCreation.Service.Cloudinary.CloudinaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

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
                .findByName(request.getCategory())
                .orElseGet(()->{
                    Category newCategory =new Category(request.getCategory());
                    return categoryRepo.save(newCategory);
                });
        request.setCategory(category.getName());

        return productRepo.save(createProduct(request,category));
    }

    private Product createProduct(ProductRequest request, Category category) {
        return new Product(
                request.getName(),
                request.getBrand(),
                request.getPrice(),
                request.getInventory(),
                request.getSize(),
                category,
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
                    .findByName(request.getCategory())
                    .orElseGet(()->{
                        Category newCategory =new Category(request.getCategory());
                        return categoryRepo.save(newCategory);
                    });

            request.setCategory(category.getName());
            products.add(createProduct(request,category));
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
    @Transactional
    public List<String> addImagesToProduct(Long productId, List<MultipartFile> images) throws IOException {
        Product product = getProductById(productId);
        List<String> imageUrls = product.getImageUrls();
        System.out.println("\nimageUrls : " + imageUrls);

        for (MultipartFile image : images) {
            String imageUrl = cloudinaryService.uploadImage(image);
            System.out.println("Image url : " + imageUrl);
            imageUrls.add(imageUrl);
        }

        System.out.println("\n\nSaving to product : ");
        product.setImageUrls(imageUrls);
        productRepo.save(product);
        System.out.println("\n\nSaved to product : ");
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
//        System.out.println("\n\n 1. Product deleted id : " + productId);
        Product product = getProductById(productId);
        for(String imageUrl : product.getImageUrls())
        {
            cloudinaryService.deleteImage(imageUrl);
        }
//        System.out.println("\n\n 2. Product deleted id : " + productId);
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
        Category foundCategory = categoryRepo.findAll().stream()
                .filter(category -> category.getName().equalsIgnoreCase(request.getCategory()))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Category Provided does not exist"));

        product.setCategory(foundCategory);
        product.setDescription(request.getDescription());

//        System.out.println("");

        return productRepo.save(product);
    }

    @Override
    public Page<Product> getProductsBySearchFilterSort(String search, String category, Boolean available, BigDecimal low, BigDecimal high, Pageable pageable) {
        Specification<Product> spec = ProductSpecification.withFilters(search, category, available, low, high);
        return productRepo.findAll(spec, pageable);
    }

}
