package com.learning.NrCreation.Service.Cart;

import java.math.BigDecimal;
import java.util.List;

import com.learning.NrCreation.Exception.InvalidInputException;
import com.learning.NrCreation.Repository.CartItemRepository;
import com.learning.NrCreation.Response.CartItemDTO;
import com.learning.NrCreation.Service.Product.ProductService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.learning.NrCreation.Exception.ResourceNotFoundException;
import com.learning.NrCreation.Entity.Cart;
import com.learning.NrCreation.Entity.CartItem;
import com.learning.NrCreation.Entity.Product;
import com.learning.NrCreation.Repository.CartRepository;

@Service
@RequiredArgsConstructor
class CartItemServiceImpl implements CartItemService {
	
	private final CartItemRepository cartItemRepo;
	private final CartRepository cartRepo;
	private final ProductService productService;
	private final CartServiceImpl cartService;
	
	//1. Get the cart
    //2. Get the product
    //3. Check whether the product already in the cart
    //4. If Yes, then increase the quantity with the requested quantity
    //5. If No, then initiate a new CartItem entry.
	@Override
	public CartItem addItemToCart(Long cartId, Long productId, int quantity)
			throws ResourceNotFoundException {
		
		Cart cart = cartService.getCartById(cartId);
		
		Product product = productService.getProductById(productId);
		
		CartItem cartItem = cart.getItems().stream()
				.filter(item -> item.getProduct().getId().equals(productId))
				.findFirst().orElse(new CartItem());

		if(cartItem.getId()==null)
		{
			cartItem.setCart(cart);
			cartItem.setProduct(product);
			cartItem.setQuantity(quantity);
			cartItem.setUnitPrice(product.getPrice());
		}
		else 
		{
			cartItem.setQuantity(cartItem.getQuantity() + quantity);
		}
		cartItem.computeAndSetTotalPrice();
		cart.addItem(cartItem);
		CartItem savedCartItem = cartItemRepo.save(cartItem);
		cartRepo.save(cart);
		return  savedCartItem;
	}

	@Override
	public void removeItemFromCart(Long cartId, Long cartItemId) {
		Cart cart = cartService.getCartById(cartId);
		CartItem itemToRemove = getCartItem(cartId, cartItemId);
		
		cart.removeItem(itemToRemove);
		cartRepo.save(cart);
	}

	@Override
	public void updateItemQuantity(Long cartId, Long cartItemId, int quantity) {
		Cart cart = cartService.getCartById(cartId);
		
		 CartItem cartItem = cart.getItems()
		            .stream()
		            .filter(item -> item.getId().equals(cartItemId))
		            .findFirst()
		            .orElseThrow(() -> new ResourceNotFoundException("CartItem not found in this Cart"));

		    if(quantity > cartItem.getProduct().getInventory())
			{
				throw new InvalidInputException("Quantity exceeds inventory!");
			}
			else if(quantity <= 0)
			{
				throw new InvalidInputException("Quantity must be greater than zero!");
			}
		    cartItem.setQuantity(quantity);
		    cartItem.setUnitPrice(cartItem.getProduct().getPrice());
		    cartItem.computeAndSetTotalPrice();
		
		BigDecimal totalAmount = cart.getTotalAmount();
		
		cart.setTotalAmount(totalAmount);
		cartRepo.save(cart);
	}

	@Override
	public CartItem getCartItem(Long cartId, Long cartItemId) {
		Cart cart = cartService.getCartById(cartId);
		return cart.getItems()
				.stream()
				.filter(item -> item.getId().equals(cartItemId))
				.findFirst().orElseThrow(()-> new ResourceNotFoundException("Cart Item not Found!"));
	}

	@Override
	public CartItemDTO convertToCartItemDTO(CartItem cartItem) {

		return new CartItemDTO(
				cartItem.getId(),
				cartItem.getQuantity(),
				cartItem.getUnitPrice(),
				cartItem.getProduct().getId(),
				cartItem.getProduct().getImageUrls().get(0),
				cartItem.getTotalPrice()
		);
	}

	@Override
	public List<CartItem> getCartItemsByCartId(Long cartId) {
		return cartItemRepo.findByCart_CartId(cartId);
	}
}
