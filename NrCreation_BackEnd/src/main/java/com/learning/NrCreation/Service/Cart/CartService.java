package com.learning.NrCreation.Service.Cart;

import java.math.BigDecimal;

import com.learning.NrCreation.Entity.Customer;
import com.learning.NrCreation.Response.CartDTO;
import com.learning.NrCreation.Entity.Cart;

public interface CartService {

    CartDTO getCartDTOResponseById(Long cartId);
    Cart getCartById(Long cartId);
    void clearCart(String authHeader);
    BigDecimal getTotalPrice(Long cartId);
    Cart getCartByCustomerId(Long customerId);
    Cart initializeNewCart(Customer user);
}