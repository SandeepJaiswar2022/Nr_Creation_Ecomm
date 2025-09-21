package com.learning.NrCreation.Repository;

import com.learning.NrCreation.Entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long>, JpaSpecificationExecutor<Order> {

//    List<Order> findByCustomer_CustomerId(Long customerId);

    Optional<Order> findByRazorpayOrderId(String razorpayOrderId);
}