package com.learning.NrCreation.Controller;

import com.learning.NrCreation.Entity.Cart;
import com.learning.NrCreation.Entity.Customer;
import com.learning.NrCreation.Entity.User;
import com.learning.NrCreation.Repository.CustomerRepository;
import com.learning.NrCreation.Response.ApiResponse;
import com.learning.NrCreation.Response.CartDTO;
import com.learning.NrCreation.Service.Cart.CartService;

import com.learning.NrCreation.Service.User.UserService;
import lombok.RequiredArgsConstructor;

import java.math.BigDecimal;
import java.util.Optional;

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
<<<<<<< Updated upstream
=======
    private final UserService userService;
    private final CustomerRepository customerRepo;


    @GetMapping("my-cart")
    @PreAuthorize("hasAnyAuthority('admin:read','user:read')")
    public ResponseEntity<ApiResponse> getMyCart(@RequestHeader("Authorization") String authHeader)
    {
        try {
            User user = userService.findUserByJwtToken(authHeader);
            Optional<Customer> customer = customerRepo.findByEmail(user.getEmail());
            if (customer.isEmpty()) {
                return new ResponseEntity<>(new ApiResponse("Customer not found with email : "+user.getEmail(), null)
                        ,HttpStatus.NOT_FOUND);
            }
            Cart cart = cartService.getCartByCustomerId(customer.get().getCustomerId());
            CartDTO cartResponse = cartService.getCartDTOResponseById(cart.getCartId());
            return new ResponseEntity<>(new ApiResponse("Cart Fetched Successfully", cartResponse)
                    ,HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new ApiResponse(e.getMessage(), null)
                    ,HttpStatus.NOT_FOUND);
        }
    }


>>>>>>> Stashed changes
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

    @DeleteMapping("/{cartId}")
    @PreAuthorize("hasAnyAuthority('admin:delete','user:delete')")
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
    @PreAuthorize("hasAnyAuthority('admin:read','user:read')")
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