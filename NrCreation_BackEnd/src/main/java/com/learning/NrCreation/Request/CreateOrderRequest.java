package com.learning.NrCreation.Request;

import com.learning.NrCreation.Response.CartItemDTO;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class CreateOrderRequest {
    private Long shippingAddressId;
    private String shippingMethod;
    private BigDecimal shippingAndTaxAmount;
    private Boolean isBuyNowRequest;
    private Long productId;
}
