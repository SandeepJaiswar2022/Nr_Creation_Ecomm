package com.learning.NrCreation.Controller;

import com.learning.NrCreation.Entity.Category;
import com.learning.NrCreation.Entity.Product;
import com.learning.NrCreation.Response.ApiResponse;
import com.learning.NrCreation.Response.PagedResponse;
import com.learning.NrCreation.Response.ProductDTO;
import com.learning.NrCreation.Service.Category.CategoryService;
import com.learning.NrCreation.Service.Product.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/public")
public class PublicController {

    private final ProductService productService;
    private final CategoryService categoryService;

    @GetMapping("/hello")
    public String hello()
    {
        return "Hello From NR Creation";
    }

    @GetMapping("category/get/all")
    public ResponseEntity<ApiResponse> getAllCategories()
    {
        try {
            List<Category> categories = categoryService.getAllCategories();
            if(categories.isEmpty())
            {
                return new ResponseEntity<>(new ApiResponse("No Category Found!", new ArrayList<>()),
                        HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(new ApiResponse
                    ("Category Fetched Successfully!",categories),
                    HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new ApiResponse("Error : ", e.getMessage())
                    ,HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("product/get/all")
    public ResponseEntity<ApiResponse> getAllProducts()
    {
        List<Product> products = productService.getAllProducts();

        if(products.isEmpty())
        {
            return new ResponseEntity<>(new ApiResponse("No Product Found!", new ArrayList<>()),
                    HttpStatus.NOT_FOUND);
        }

        List<ProductDTO> productDTOs = productService.getConvertedProducts(products);
        return new ResponseEntity<>(new ApiResponse("Product Fetched.",productDTOs) ,HttpStatus.OK);
    }

    @GetMapping("product/get/{productId}")
    public ResponseEntity<ApiResponse> getSingleProduct(@PathVariable Long productId)
    {
        Product product = productService.getProductById(productId);

        ProductDTO productDTO = productService.convertToDto(product);
        return new ResponseEntity<>(new ApiResponse("Product Fetched!",productDTO) ,HttpStatus.OK);
    }


    //1. Get all the images(Cloudinary urls) of particular product
    @GetMapping("get-all-images/{productId}")
    public ResponseEntity<ApiResponse> getProductImages(@PathVariable("productId") Long productId) {
        Product product = productService.getProductById(productId);
        if(product.getImageUrls().isEmpty())
        {
            return new ResponseEntity<>(new ApiResponse("No Image URLs found!",new ArrayList<>()), HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(new ApiResponse("Product Image URLs Fetched!",product.getImageUrls()), HttpStatus.OK);
    }

    @GetMapping("product/get-all")
    public ResponseEntity<?> getAllTheProducts( @RequestParam(required = false) String search,
                                                          @RequestParam(required = false) String category,
                                                          @RequestParam(required = false) Boolean available,
                                                @RequestParam(defaultValue = "0") BigDecimal low,
                                                @RequestParam(defaultValue = "100000") BigDecimal high,
                                                          @RequestParam(defaultValue = "0") int page,
                                                          @RequestParam(defaultValue = "10") int size,
                                                          @RequestParam(defaultValue = "asc") String sortDir)
    {

        System.out.println("\n\nSearch : "+search+"\nCategory : "+category+"\nAvailable : "+available+"\nPage : "+page+"\nSize : "+size+ "\nLow : "+low+"\nHigh : "+high);
        int maxPageSize = 50;
        if (size > maxPageSize) size = maxPageSize;

        Sort.Direction direction;
        try {
            direction = Sort.Direction.fromString(sortDir);
        } catch (IllegalArgumentException | NullPointerException e) {
            direction = Sort.Direction.ASC;
        }

        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, "price"));
        Page<Product> productsPage = productService.getProductsBySearchFilterSort(search, category, available, low, high, pageable);

        List<ProductDTO> productDTOs = productsPage.getContent()
                .stream()
                .map(productService::convertToDto)
                .toList();

        PagedResponse<ProductDTO> response = new PagedResponse<>(
                "All Products Fetched", productDTOs, productsPage
        );
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

}
