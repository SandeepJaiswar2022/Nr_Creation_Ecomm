package com.learning.NrCreation.Service.Cart;

import com.learning.NrCreation.Entity.Cart;
import com.learning.NrCreation.Entity.User;
import com.learning.NrCreation.Exception.ResourceNotFoundException;
import com.learning.NrCreation.Repository.CartItemRepository;
import com.learning.NrCreation.Repository.CartRepository;
import com.learning.NrCreation.Response.CartDTO;
import com.learning.NrCreation.Response.CartItemDTO;
import com.learning.NrCreation.Service.User.UserService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService{
    private final CartRepository cartRepo;
    private final CartItemRepository cartItemRepo;
    private final UserService userService;

    @Override
    public Cart getCartById(Long cartId)
    {
        return cartRepo.findById(cartId)
                .orElseThrow(()->new ResourceNotFoundException("Cart Not Found!"));
    }

    @Override
    public CartDTO getCartDTOResponseById(Long cartId) {
        Cart cart = getCartById(cartId);
        Set<CartItemDTO> cartItems = cart.getItems().stream()
                .map(item -> new CartItemDTO(
                                item.getId(),
                                item.getQuantity(),
                                item.getUnitPrice(),
                                item.getProduct().getId(),
                                item.getProduct().getImageUrls().get(0),
                                item.getTotalPrice()
                        )
                ).collect(Collectors.toSet());

        return new CartDTO(cart.getCartId(),cartItems,cart.getTotalAmount());
    }

    @Override
    @Transactional
    public void clearCart(String authHeader) {

        // Break the association with CartUser first
        User user = userService.findUserByJwtToken(authHeader);
        Cart cart = getCartByUserId(user.getId());
        user.setCart(null); // Remove reference


        cartItemRepo.deleteAllByCart_CartId(cart.getCartId());
        cart.getItems().clear();
        cartRepo.delete(cart);
        //Cleared All the cartItem and Removed Cart from DB;
    }

    @Override
    public BigDecimal getTotalPrice(Long cartId) {
        Cart cart = getCartById(cartId);
        return cart.getTotalAmount();
    }

    @Override
    public Cart initializeNewCart(User user) {
//        System.out.println("M I initializing new Cart with customer: " + user.getEmail());
        return cartRepo.findByUserId(user.getId())
                .orElseGet(() -> {
                    Cart cart = new Cart();
                    cart.setUser(user);
                    return cartRepo.save(cart);
                });

    }

    @Override
    public Cart getCartByUserId(Long userId) {
        return cartRepo.findByUserId(userId).orElseThrow(()-> new ResourceNotFoundException("No Cart Item Found, Cart is Empty!"));
    }
}
