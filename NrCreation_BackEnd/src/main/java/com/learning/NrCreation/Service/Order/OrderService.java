package com.learning.NrCreation.Service.Order;

import com.learning.NrCreation.Entity.Order;
import com.learning.NrCreation.Enum.OrderStatus;
import com.learning.NrCreation.Request.CreateOrderRequest;
import com.learning.NrCreation.Response.OrderDTO;
import com.razorpay.RazorpayException;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Map;

public interface OrderService {
    @Transactional
    Map<String, String> createOrder(String authHeader, CreateOrderRequest orderRequest) throws RazorpayException;

    Order getOrderById(Long orderId);
    Page<OrderDTO> getParticularCustomerAllOrders(String authHeader, String search, OrderStatus status, String shippingMethod, LocalDate startDate, LocalDate endDate, BigDecimal priceLow, BigDecimal priceHigh, Pageable pageable);
    public OrderDTO convertToDto(Order order);

    Page<OrderDTO> getAllOrders(String search,OrderStatus status, String shippingMethod, LocalDate startDate, LocalDate endDate, BigDecimal low, BigDecimal high, Pageable pageable);

    void deleteOrderById(Long orderId);
}
