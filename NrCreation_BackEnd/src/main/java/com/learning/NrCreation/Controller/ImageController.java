package com.learning.NrCreation.Controller;

import com.learning.NrCreation.Entity.Product;
import com.learning.NrCreation.Response.ApiResponse;
import com.learning.NrCreation.Service.Product.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("${api.prefix}/image")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class ImageController {
    private final ProductService productService;


    //1. Adding Single/Multiple images to particular product and providing urls
    @PostMapping("add/{productId}")
    public ResponseEntity<ApiResponse> addProductImage(@PathVariable Long productId,@RequestParam List<MultipartFile> images) {
        try {
            List<String> imageUrls = productService.addImagesToProduct(productId,images);
            return new ResponseEntity<>(new ApiResponse("Product Images Added!",imageUrls), HttpStatus.OK);
        }
        catch (Exception e)
        {
         return new ResponseEntity<>(new ApiResponse(e.getMessage(),null), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //2. Delete a particular Image url from the Product
    @DeleteMapping("delete/{productId}")
    public ResponseEntity<ApiResponse> deleteProductImage(@PathVariable Long productId, @RequestParam String url) {
        try {
            productService.deleteProductImage(productId,url);
            return new ResponseEntity<>(new ApiResponse("Product Images Deleted!",null), HttpStatus.OK);
        }
        catch (Exception e)
        {
            return new ResponseEntity<>(new ApiResponse(e.getMessage(),null), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //3. Delete all image urls from the product

}
