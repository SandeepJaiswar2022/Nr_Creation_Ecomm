package com.learning.NrCreation.Controller;

import com.learning.NrCreation.Entity.Product;
import com.learning.NrCreation.Request.ProductRequest;
import com.learning.NrCreation.Response.ApiResponse;
import com.learning.NrCreation.Response.ProductDTO;
import com.learning.NrCreation.Service.Product.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("${api.prefix}/product")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;

    //Create single product------------------------------
    @PreAuthorize("hasAuthority('admin:create')")
    @PostMapping("add")
    public ResponseEntity<ApiResponse> addProduct(@RequestBody ProductRequest request)
    {
        try {
            Product product = productService.addProduct(request);
            //Convert To DTO then Send
            ProductDTO productDTO = productService.convertToDto(product);
            return new ResponseEntity<>(new ApiResponse("Product Added Successfully", productDTO),
                    HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(new ApiResponse(e.getMessage(), null),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //Create Multiple Product------------------------------
    @PostMapping("add/multiple")
    @PreAuthorize("hasAuthority('admin:create')")
    public ResponseEntity<ApiResponse> addMultipleProduct(@RequestBody List<ProductRequest> requests)
    {
        try {
            List<Product> products = productService.addMultipleProducts(requests);

            if(products.isEmpty())
            {
                return new ResponseEntity<>(new ApiResponse("Could not Add Products, Server Error!", null),
                        HttpStatus.INTERNAL_SERVER_ERROR);
            }
            return new ResponseEntity<>(new ApiResponse("Added Multiple Products!",products.size()+" Products Added Successfully"),
                    HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(new ApiResponse(e.getMessage(), null),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //Delete a Product------------------------------
    @PreAuthorize("hasAuthority('admin:delete')")
    @DeleteMapping("delete/{productId}")
    public ResponseEntity<ApiResponse> deleteProduct(@PathVariable Long productId)
    {
        try {
            productService.deleteProduct(productId);
            return new ResponseEntity<>(new ApiResponse("Product Deleted Successfully",null),
                    HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new ApiResponse(e.getMessage(), null),
                    HttpStatus.BAD_REQUEST);
        }
    }

    //Update a particular product------------------------------
    @PreAuthorize("hasAuthority('admin:update')")
    @PutMapping("update/{productId}")
    public ResponseEntity<ApiResponse> updateProduct(@PathVariable Long productId, @RequestBody ProductRequest request)
    {
        try {
            Product updatedProduct =  productService.updateProduct(productId, request);
            ProductDTO productDTO = productService.convertToDto(updatedProduct);
            return new ResponseEntity<>(new ApiResponse("Product Updated Successfully",productDTO),
                    HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new ApiResponse(e.getMessage(), null),
                    HttpStatus.BAD_REQUEST);
        }
    }
}
