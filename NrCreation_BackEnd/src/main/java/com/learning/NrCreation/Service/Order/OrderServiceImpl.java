package com.learning.NrCreation.Service.Order;

import com.learning.NrCreation.Entity.*;
import com.learning.NrCreation.Enum.OrderStatus;
import com.learning.NrCreation.Repository.CustomerRepository;
import com.learning.NrCreation.Repository.OrderRepository;
import com.learning.NrCreation.Response.AddressDTO;
import com.learning.NrCreation.Response.OrderDTO;
import com.learning.NrCreation.Response.OrderItemDTO;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {
    private final OrderRepository orderRepository;
    private final CustomerRepository customerRepository;
    private final RazorpayClient razorpayClient;



    @Transactional
    @Override
    public Order placeOrder(Long customerId, OrderDTO orderRequest) throws RazorpayException {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        // Create order entity
        Order order = new Order();
        order.setCustomer(customer);
        order.setOrderDate(LocalDate.now());
        order.setOrderStatus(OrderStatus.PENDING);
        order.setShippingMethod(orderRequest.getShippingMethod());

        // Set shipping address
        AddressDTO address = orderRequest.getShippingAddress();
        Address shippingAddress = new Address();
        shippingAddress.setCity(address.getCity());
        shippingAddress.setCountry(address.getCountry());
        shippingAddress.setState(address.getState());
        shippingAddress.setAddress1(address.getAddress1());
        shippingAddress.setAddress2(address.getAddress2());
        order.setShippingAddress(shippingAddress);
        // Create order items
        Set<OrderItem> orderItems = orderRequest.getOrderItems().stream()
                .map(item -> {
                    OrderItem orderItem = new OrderItem();
                    orderItem.setOrder(order);
                    orderItem.setProductId(item.getProductId());
                    orderItem.setQuantity(item.getQuantity());
                    orderItem.setPrice(item.getPrice());
                    orderItem.setOriginalPrice(item.getOriginalPrice() != null ? item.getOriginalPrice() : item.getPrice());
                    return orderItem;
                })
                .collect(Collectors.toSet());
        order.setOrderItems(orderItems);

        // Calculate total amount
        BigDecimal totalAmount = orderRequest.getOrderAmount();
        order.setOrderAmount(totalAmount);

        // Create Razorpay order
        JSONObject orderRequestJson = new JSONObject();
        orderRequestJson.put("amount", totalAmount.multiply(BigDecimal.valueOf(100)).intValue()); // Amount in paise
        orderRequestJson.put("currency", "INR");
        orderRequestJson.put("receipt", "order_rcptid_" + customerId);

        com.razorpay.Order razorpayOrder = razorpayClient.orders.create(orderRequestJson);
        order.setRazorpayOrderId(razorpayOrder.get("id"));

        // Save order
        return orderRepository.save(order);
    }

    @Override
    public OrderDTO getOrderById(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        return convertToDto(order);
    }

    @Override
    public List<OrderDTO> getOrderByUserId(Long userId) {
        List<Order> orders = orderRepository.findByCustomer_CustomerId(userId);
        return orders.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    @Override
    public OrderDTO convertToDto(Order order) {
        OrderDTO dto = new OrderDTO();
        dto.setOrderId(order.getOrderId());
        dto.setOrderDate(order.getOrderDate());
        dto.setOrderAmount(order.getOrderAmount());
        dto.setShippingDate(order.getShippingDate());
        dto.setOrderStatus(order.getOrderStatus().name());
        dto.setCustomerId(order.getCustomer().getCustomerId());
        dto.setRazorpayOrderId(order.getRazorpayOrderId());
        dto.setRazorpayOrderId(order.getRazorpayPaymentId());
        dto.setShippingMethod(order.getShippingMethod());

        // Set shipping address
        AddressDTO addressDTO = new AddressDTO();
        addressDTO.setAddress1(order.getShippingAddress().getAddress1());
        addressDTO.setAddress2(order.getShippingAddress().getAddress2() != null ? order.getShippingAddress().getAddress2() : "");
        addressDTO.setCity(order.getShippingAddress().getCity());
        addressDTO.setState(order.getShippingAddress().getState() != null ? order.getShippingAddress().getState() : "");
        addressDTO.setPinCode(order.getShippingAddress().getPinCode() != null ? order.getShippingAddress().getPinCode() : "");
        addressDTO.setCountry(order.getShippingAddress().getCountry() != null ? order.getShippingAddress().getCountry() : "");
        dto.setShippingAddress(addressDTO);

        // Set order items
        Set<OrderItemDTO> itemDTOs = order.getOrderItems().stream()
                .map(item -> {
                    OrderItemDTO itemDTO = new OrderItemDTO();
                    itemDTO.setId(item.getId());
                    itemDTO.setProductId(item.getProductId());
                    itemDTO.setQuantity(item.getQuantity());
                    itemDTO.setPrice(item.getPrice());
                    itemDTO.setOriginalPrice(item.getOriginalPrice());
                    return itemDTO;
                })
                .collect(Collectors.toSet());
        dto.setOrderItems(itemDTOs);

        return dto;
    }

    @Transactional
    @Override
    public void verifyPayment(Long orderId, String razorpayPaymentId, String razorpayOrderId, String razorpaySignature) throws RazorpayException {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // Verify payment signature (use Razorpay Utils)
        // Example: Utils.verifyPaymentSignature(params, razorpayKeySecret);
        // For now, assume signature is valid
        order.setRazorpayPaymentId(razorpayPaymentId);
        order.setOrderStatus(OrderStatus.CONFIRMED);
        orderRepository.save(order);
    }

    private BigDecimal calculateTotalAmount(Set<OrderItem> orderItems) {
        // Implement logic to calculate total amount from order items
        return orderItems.stream()
                .map(item -> item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private String generateSignature(String razorpayOrderId, String razorpayPaymentId) {
        // Implement signature generation logic (use Razorpay Utils)
        return "generated_signature"; // Placeholder
    }

}
