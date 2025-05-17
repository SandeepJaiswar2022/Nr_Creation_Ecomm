package com.learning.NrCreation.Service.Order;

import com.learning.NrCreation.Entity.Order;
import com.learning.NrCreation.Exception.ResourceNotFoundException;
import com.learning.NrCreation.Response.OrderDTO;
import com.razorpay.RazorpayException;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

public interface OrderService {
    @Transactional
    Order placeOrder(Long customerId, OrderDTO orderRequest) throws RazorpayException;

    OrderDTO getOrderById(Long orderId);
    List<OrderDTO> getOrderByUserId(Long userId);
    public OrderDTO convertToDto(Order order);
    void verifyPayment(Long orderId, String razorpayPaymentId, String razorpayOrderId, String razorpaySignature) throws RazorpayException;
}
