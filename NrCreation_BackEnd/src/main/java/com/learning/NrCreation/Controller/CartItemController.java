package com.learning.NrCreation.Controller;

import com.learning.NrCreation.Entity.Cart;
import com.learning.NrCreation.Entity.Customer;
import com.learning.NrCreation.Exception.ResourceNotFoundException;
import com.learning.NrCreation.Response.ApiResponse;
import com.learning.NrCreation.Service.Cart.CartItemService;
import com.learning.NrCreation.Service.Cart.CartService;
import com.learning.NrCreation.Service.User.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("${api.prefix}/cart-item")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('USER')")
public class CartItemController {
    private final CartItemService cartItemService;
    private final CartService cartService;
    private final UserService userService;

    //Handle Exception if the quantity to update is greater than the Stock(Inventory)
    @PreAuthorize("hasAuthority('user:create')")
    @PostMapping("/add")
    public ResponseEntity<ApiResponse> addItemToCart(
            @RequestParam Long userId,
            @RequestParam Long productId,
            @RequestParam Integer quantity)
    {
        try {
            log.debug("Adding product to user {}", userId);
            Customer user = userService.getUserById(userId);
            log.debug("customer by id user found ");
            Cart cart = cartService.initializeNewCart(user);
            log.debug("customer cart found ");
            cartItemService.addItemToCart(cart.getCartId(), productId, quantity);
            return new ResponseEntity<>(new
                    ApiResponse("Item Added Successfully", null), HttpStatus.OK);

        } catch (ResourceNotFoundException e) {
            return new ResponseEntity<>(new ApiResponse(e.getMessage(), null)
                    ,HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/delete")
    public ResponseEntity<ApiResponse> deleteItemFromCart(@RequestParam Long cartId,
                                                          @RequestParam Long cartItemId )
    {
        try {
            cartItemService.removeItemFromCart(cartId, cartItemId);
            return new ResponseEntity<>(new ApiResponse("Item Deleted Successfully", null)
                    ,HttpStatus.OK);
        } catch (ResourceNotFoundException e) {
            return new ResponseEntity<>(new ApiResponse(e.getMessage(), null)
                    ,HttpStatus.NOT_FOUND);
        }
    }

    //Handle Exception if the quantity to update is greater than the Stock(Inventory)
    //Handle Exception if the quantity = 0.
    @PutMapping("/update")
    public ResponseEntity<ApiResponse> updateItemQuantity(@RequestParam Long cartId, @RequestParam
    Long cartItemId, @RequestParam Integer quantity)
    {
        try {
            cartItemService.updateItemQuantity(cartId, cartItemId, quantity);
            return new ResponseEntity<>(new ApiResponse("Quantity Updated Successfulyy", null)
                    ,HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new ApiResponse(e.getMessage(), null)
                    ,HttpStatus.NOT_FOUND);
        }
    }
}
