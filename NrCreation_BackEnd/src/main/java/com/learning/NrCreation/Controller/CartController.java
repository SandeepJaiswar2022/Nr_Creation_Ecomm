package com.learning.NrCreation.Controller;

import com.learning.NrCreation.Response.ApiResponse;
import com.learning.NrCreation.Response.CartDTO;
import com.learning.NrCreation.Service.Cart.CartService;

import lombok.RequiredArgsConstructor;

import java.math.BigDecimal;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/cart")
@PreAuthorize("hasAnyRole('ADMIN','USER')")
public class CartController {
    private final CartService cartService;
    @GetMapping("/{cartId}")
    public ResponseEntity<ApiResponse> getCart(@PathVariable Long cartId)
    {
        try {
            CartDTO cart = cartService.getCartDTOResponseById(cartId);
            return new ResponseEntity<>(new ApiResponse("Cart Fetched Successfully", cart)
                    ,HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new ApiResponse(e.getMessage(), null)
                    ,HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{cartId}")
    public ResponseEntity<ApiResponse> clearCart(@PathVariable Long cartId)
    {
        try {
            cartService.clearCart(cartId);
            return new ResponseEntity<>(new ApiResponse("Cart Cleared Successfully", null)
                    ,HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new ApiResponse(e.getMessage(), null)
                    ,HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/total-price/{cartId}")
    public ResponseEntity<ApiResponse> getTotalPriceOfCart(@PathVariable Long cartId)
    {
        try {
            BigDecimal totalPrice =  cartService.getTotalPrice(cartId);
            return new ResponseEntity<>(new ApiResponse("Total Price", totalPrice)
                    ,HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new ApiResponse(e.getMessage(), null)
                    ,HttpStatus.NOT_FOUND);
        }
    }
}