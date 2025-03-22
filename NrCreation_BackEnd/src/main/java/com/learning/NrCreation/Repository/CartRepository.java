package com.learning.NrCreation.Repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.learning.NrCreation.Entity.Cart;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {

	Cart findByCustomer_CustomerId(Long customerId);
}
