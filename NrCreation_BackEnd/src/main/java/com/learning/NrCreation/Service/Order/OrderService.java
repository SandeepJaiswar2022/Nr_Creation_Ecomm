package com.learning.NrCreation.Service.Order;

import com.learning.NrCreation.Entity.Order;
import com.learning.NrCreation.Exception.ResourceNotFoundException;
import com.learning.NrCreation.Request.CreateOrderRequest;
import com.learning.NrCreation.Response.OrderDTO;
import com.razorpay.RazorpayException;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

public interface OrderService {
    @Transactional
    Map<String, String> createOrder(String authHeader, CreateOrderRequest orderRequest) throws RazorpayException;

    OrderDTO getOrderById(Long orderId);
    List<OrderDTO> getParticularCustomerAllOrders(String authHeader);
    public OrderDTO convertToDto(Order order);
}
