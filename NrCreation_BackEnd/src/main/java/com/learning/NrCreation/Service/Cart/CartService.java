package com.learning.NrCreation.Service.Cart;

import java.math.BigDecimal;

import com.learning.NrCreation.Entity.Customer;
import com.learning.NrCreation.Response.CartDTO;
import com.learning.NrCreation.Entity.Cart;

public interface CartService {

    CartDTO getCartDTOResponseById(Long cartId);
    Cart getCartById(Long cartId);
    void clearCart(Long cartId);
    BigDecimal getTotalPrice(Long cartId);
    Cart getCartByUserId(Long userId);
    Cart initializeNewCart(Customer user);
}