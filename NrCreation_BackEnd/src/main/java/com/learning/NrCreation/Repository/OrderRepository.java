package com.learning.NrCreation.Repository;

import com.learning.NrCreation.Entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.nio.channels.FileChannel;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long>, JpaSpecificationExecutor<Order> {

    List<Order> findByCustomer_CustomerId(Long customerId);

    Optional<Order> findByRazorpayOrderId(String razorpayOrderId);
}