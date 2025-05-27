package com.learning.NrCreation.Service.Cart;

import com.learning.NrCreation.Entity.Cart;
import com.learning.NrCreation.Entity.Customer;
import com.learning.NrCreation.Exception.ResourceNotFoundException;
import com.learning.NrCreation.Repository.CartItemRepository;
import com.learning.NrCreation.Repository.CartRepository;
import com.learning.NrCreation.Response.CartDTO;
import com.learning.NrCreation.Response.CartItemDTO;
import com.learning.NrCreation.Service.Product.ProductService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService{
    private final CartRepository cartRepo;
    private final CartItemRepository cartItemRepo;
    private final ProductService productService;

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
    public void clearCart(Long cartId) {
        Cart cart = getCartById(cartId);

        // Break the association with CartUser first
        Customer user = cart.getCustomer();
        if (user != null) {
            user.setCart(null); // Remove reference
        }

        cartItemRepo.deleteAllByCart_CartId(cartId);
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
    public Cart initializeNewCart(Customer customer) {
        System.out.println("M I initializing new Cart with customer: " + customer.getEmail());
        return cartRepo.findByCustomer_CustomerId(customer.getCustomerId())
                .orElseGet(() -> {
                    Cart cart = new Cart();
                    cart.setCustomer(customer);
                    return cartRepo.save(cart);
                });

    }

    @Override
    public Cart getCartByCustomerId(Long userId) {
        return cartRepo.findByCustomer_CustomerId(userId).orElseThrow(()-> new ResourceNotFoundException("No Cart Item Found, Cart is Empty!"));
    }
}
