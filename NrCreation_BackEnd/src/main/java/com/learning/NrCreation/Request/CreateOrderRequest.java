package com.learning.NrCreation.Request;

import com.learning.NrCreation.Response.CartItemDTO;
import lombok.Data;

import java.util.List;

@Data
public class CreateOrderRequest {
    private List<CartItemDTO> cartItems;
    private Long shippingAddressId;
    private String shippingMethod;
}
