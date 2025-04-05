package com.learning.NrCreation.Controller;

import com.learning.NrCreation.Entity.Product;
import com.learning.NrCreation.Response.ApiResponse;
import com.learning.NrCreation.Response.ProductDTO;
import com.learning.NrCreation.Service.Product.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/public")
public class PublicController {

    private final ProductService productService;

    @GetMapping("/hello")
    public String hello()
    {
        return "Hello From NR Creation";
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
        return new ResponseEntity<>(new ApiResponse("All Product Fetched",productDTOs) ,HttpStatus.OK);
    }


    //1. Get all the images(Cloudinary urls) of particular product
    @GetMapping("get-all/{productId}")
    public ResponseEntity<ApiResponse> getProductImages(@PathVariable("productId") Long productId) {
        Product product = productService.getProductById(productId);
        if(product.getImageUrls().isEmpty())
        {
            return new ResponseEntity<>(new ApiResponse("No Image URLs found!",new ArrayList<>()), HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(new ApiResponse("Product Image URLs Fetched!",product.getImageUrls()), HttpStatus.OK);
    }

}
