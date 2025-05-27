package com.learning.NrCreation.Service.Order;

import com.learning.NrCreation.Entity.*;
import com.learning.NrCreation.Enum.OrderStatus;
import com.learning.NrCreation.Exception.ResourceNotFoundException;
import com.learning.NrCreation.Repository.AddressRepository;
import com.learning.NrCreation.Repository.CustomerRepository;
import com.learning.NrCreation.Repository.OrderRepository;
import com.learning.NrCreation.Request.CreateOrderRequest;
import com.learning.NrCreation.Response.AddressDTO;
import com.learning.NrCreation.Response.CartItemDTO;
import com.learning.NrCreation.Response.OrderDTO;
import com.learning.NrCreation.Response.OrderItemDTO;
import com.learning.NrCreation.Service.Razorpay.RazorpayService;
import com.learning.NrCreation.Service.User.UserService;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {
    private final OrderRepository orderRepository;
    private final CustomerRepository customerRepository;
    private final RazorpayService razorpayService;

    private final UserService userService;
    private final AddressRepository addressRepository;



    @Transactional
    @Override
    public Map<String, String> createOrder(String authHeader, CreateOrderRequest orderRequest) throws RazorpayException {

        User user = userService.findUserByJwtToken(authHeader);

        Optional<Customer> customer = customerRepository.findByEmail(user.getEmail());
        if (customer.isEmpty()) {
            throw new ResourceNotFoundException("Customer not found!");
        }

        Address address = addressRepository.findById(orderRequest.getShippingAddressId())
                .orElseThrow(() -> new ResourceNotFoundException("Shipping address not found"));

        // Create order entity
        Order order = new Order();
        order.setCustomer(customer.get());
        order.setOrderDate(LocalDateTime.now());
        order.setOrderStatus(OrderStatus.PENDING);
        order.setShippingMethod(orderRequest.getShippingMethod());
        order.setShippingAddress(address);


        Set<OrderItem> orderItems = new HashSet<>();
        BigDecimal totalAmount = BigDecimal.ZERO;

        // Create order items

        for (CartItemDTO cartItem : orderRequest.getCartItems()) {
            OrderItem item = new OrderItem();
            item.setProductId(cartItem.getProductId());
            item.setQuantity(cartItem.getQuantity());
            item.setPrice(cartItem.getUnitPrice());
            item.setTotalPrice(cartItem.getTotalPrice());
            item.setOrder(order);
            totalAmount = totalAmount.add(item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
            orderItems.add(item);
        }
        order.setOrderAmount(totalAmount);
        order.setOrderItems(orderItems);


        // Create Razorpay order
        JSONObject orderRequestJson = new JSONObject();
        orderRequestJson.put("amount", totalAmount.multiply(BigDecimal.valueOf(100)).intValue()); // Amount in paise
        orderRequestJson.put("currency", "INR");
        orderRequestJson.put("receipt", "order_rcptid_" + customer.get().getCustomerId());

        Map<String,String> razorpayResponse = razorpayService.createRazorPayOrder(orderRequestJson);
        order.setRazorpayOrderId(razorpayResponse.get("razorpayOrderId"));

        // Save order
        orderRepository.save(order);

        return razorpayResponse;
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
                    itemDTO.setTotalPrice(item.getTotalPrice());
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
