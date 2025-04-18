package com.learning.NrCreation.Service.Cart;

import com.learning.NrCreation.Entity.CartItem;

import java.util.List;

public interface CartItemService {
	
	CartItem addItemToCart(Long cartId, Long productId, int quantity);
	void removeItemFromCart(Long cartId, Long productId);
	void updateItemQuantity(Long cartId, Long productId, int quantity);
	CartItem getCartItem(Long cartId, Long productId);

	List<CartItem> getCartItemsByCartId(Long cartId);
}
