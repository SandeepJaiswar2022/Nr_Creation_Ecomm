package com.learning.NrCreation.Controller;

import com.learning.NrCreation.Entity.Cart;
import com.learning.NrCreation.Entity.User;
import com.learning.NrCreation.Response.ApiResponse;
import com.learning.NrCreation.Response.CartDTO;
import com.learning.NrCreation.Service.Cart.CartService;

import com.learning.NrCreation.Service.User.UserService;
import lombok.RequiredArgsConstructor;

import java.math.BigDecimal;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/cart")
@PreAuthorize("hasAnyRole('ADMIN','USER')")
public class CartController {
    private final CartService cartService;
    private final UserService userService;

    @GetMapping("my-cart")
    @PreAuthorize("hasAnyAuthority('admin:read','user:read')")
    public ResponseEntity<ApiResponse> getMyCart(@RequestHeader("Authorization") String authHeader)
    {
        try {
            User user = userService.findUserByJwtToken(authHeader);
            Cart cart = cartService.getCartByUserId(user.getId());
            CartDTO cartResponse = cartService.getCartDTOResponseById(cart.getCartId());
            return new ResponseEntity<>(new ApiResponse("Cart Fetched Successfully", cartResponse)
                    ,HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new ApiResponse(e.getMessage(), null)
                    ,HttpStatus.NOT_FOUND);
        }
    }


    @GetMapping("/{cartId}")
    @PreAuthorize("hasAnyAuthority('admin:read')")
    public ResponseEntity<ApiResponse> getCartByID(@PathVariable Long cartId)
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

    @DeleteMapping("/clear-cart")
    @PreAuthorize("hasAnyAuthority('admin:delete','user:delete')")
    public ResponseEntity<ApiResponse> clearCart(@RequestHeader("Authorization") String authHeader)
    {
        try {
            cartService.clearCart(authHeader);
            return new ResponseEntity<>(new ApiResponse("Cart Cleared Successfully", null)
                    ,HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new ApiResponse(e.getMessage(), null)
                    ,HttpStatus.NOT_FOUND);
        }
    }

    @PreAuthorize("hasAnyAuthority('admin:read','user:read')")
    @GetMapping("/total-price/{cartId}")
    public ResponseEntity<ApiResponse> getTotalPriceOfCart(@PathVariable Long cartId)
    {
        try {
            System.out.println("Get Total Price of Cart\n\n\n");
            BigDecimal totalPrice =  cartService.getTotalPrice(cartId);
            return new ResponseEntity<>(new ApiResponse("Total Price", totalPrice)
                    ,HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new ApiResponse(e.getMessage(), null)
                    ,HttpStatus.NOT_FOUND);
        }
    }
}