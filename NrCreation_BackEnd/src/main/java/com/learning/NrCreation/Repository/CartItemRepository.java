package com.learning.NrCreation.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.learning.NrCreation.Entity.CartItem;

import java.util.List;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
	void deleteAllByCart_CartId(Long cartId);

    List<CartItem> findByCart_CartId(Long cartId);
}