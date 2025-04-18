package com.learning.NrCreation.Repository;


import com.learning.NrCreation.Entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.learning.NrCreation.Entity.Cart;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {

	Cart findByCustomer_CustomerId(Long customerId);

//    List<CartItem> findByCart_CartId(Long cartId);
}
