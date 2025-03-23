package com.learning.NrCreation.Service.Order;

import com.learning.NrCreation.Entity.Order;
import com.learning.NrCreation.Response.OrderDTO;
import org.springframework.stereotype.Service;

import java.util.List;

public interface OrderService {
    public Order placeOrder(Long userId);
    OrderDTO getOrder(Long orderId);
    List<OrderDTO> getUserOrders(Long userId);
    public OrderDTO convertToDto(Order order);
}
