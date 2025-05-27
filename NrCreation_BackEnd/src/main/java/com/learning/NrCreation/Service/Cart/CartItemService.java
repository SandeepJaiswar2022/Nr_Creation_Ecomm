package com.learning.NrCreation.Service.Cart;

import com.learning.NrCreation.Entity.CartItem;
import com.learning.NrCreation.Response.CartItemDTO;

import java.util.List;

public interface CartItemService {
	
	CartItem addItemToCart(Long cartId, Long productId, int quantity);
	void removeItemFromCart(Long cartId, Long productId);
	void updateItemQuantity(Long cartId, Long productId, int quantity);
	CartItem getCartItem(Long cartId, Long productId);
	CartItemDTO convertToCartItemDTO(CartItem cartItem);

	List<CartItem> getCartItemsByCartId(Long cartId);
}
