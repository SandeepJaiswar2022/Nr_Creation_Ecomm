package com.learning.NrCreation.Service.Product;

import com.learning.NrCreation.Entity.Product;
import com.learning.NrCreation.Request.ProductRequest;
import com.learning.NrCreation.Response.ProductDTO;

import java.util.List;

public interface ProductService {
    Product addProduct(ProductRequest request);
    List<Product> getAllProducts();
    List<Product> addMultipleProducts(List<ProductRequest> requests);
    ProductDTO convertToDto(Product product);
    List<ProductDTO> getConvertedProducts(List<Product> products);
}
