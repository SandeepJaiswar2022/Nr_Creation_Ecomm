package com.learning.NrCreation.Service.Order;

import com.learning.NrCreation.Entity.*;
import com.learning.NrCreation.Enum.OrderStatus;
import com.learning.NrCreation.Repository.OrderRepository;
import com.learning.NrCreation.Request.CreateOrderRequest;
import com.learning.NrCreation.Response.AddressDTO;
import com.learning.NrCreation.Response.CartItemDTO;
import com.learning.NrCreation.Response.OrderDTO;
import com.learning.NrCreation.Response.OrderItemDTO;
import com.learning.NrCreation.Service.Address.AddressService;
import com.learning.NrCreation.Service.Cart.CartService;
import com.learning.NrCreation.Service.Customer.CustomerService;
import com.learning.NrCreation.Service.Razorpay.RazorpayService;
import com.learning.NrCreation.Service.User.UserService;
import com.razorpay.RazorpayException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {
    private static final Logger log = LoggerFactory.getLogger(OrderServiceImpl.class);
    private final OrderRepository orderRepository;
    private final CartService cartService;
    private final CustomerService customerService;
    private final RazorpayService razorpayService;
    private final AddressService addressService;

    private final UserService userService;



    @Transactional
    @Override
    public Map<String, String> createOrder(String authHeader, CreateOrderRequest orderRequest) throws RazorpayException {

        User user = userService.findUserByJwtToken(authHeader);

       Customer customer = customerService.findCustomerByEmail(user.getEmail());

        Address address = addressService.getAddressByIdAndAuthHeader(orderRequest.getShippingAddressId(), authHeader);

        // Create order entity
        Order order = new Order();
        order.setCustomer(customer);
        order.setOrderDate(LocalDateTime.now());
        order.setOrderStatus(OrderStatus.PENDING);
        order.setShippingMethod(orderRequest.getShippingMethod());
        order.setShippingAddress(address);


        Set<OrderItem> orderItems = new HashSet<>();
        BigDecimal totalAmount = BigDecimal.ZERO;

        // Create order items
        Cart cart = cartService.getCartByCustomerId(customer.getCustomerId());

        for (CartItem cartItem : cart.getItems()) {
            OrderItem item = new OrderItem();
            item.setProductId(cartItem.getProduct().getId());
            item.setQuantity(cartItem.getQuantity());
            item.setPrice(cartItem.getUnitPrice());
            item.setTotalPrice(cartItem.getTotalPrice());
            System.out.println("Image url : " + cartItem.getProduct().getImageUrls().get(0));
            item.setImageUrl(cartItem.getProduct().getImageUrls().get(0));
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
        orderRequestJson.put("receipt", "order_rcptid_" + customer.getCustomerId());

        Map<String,String> razorpayResponse = razorpayService.createRazorPayOrder(orderRequestJson);
        order.setRazorpayOrderId(razorpayResponse.get("razorpayOrderId"));

        // Save order
        orderRepository.save(order);
        System.out.println("\n\nOrder Created Successfully!\n\n");
        return razorpayResponse;
    }

    @Override
    public OrderDTO getOrderById(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        return convertToDto(order);
    }

    @Override
    public List<OrderDTO> getParticularCustomerAllOrders(String authHeader) {
        User user = userService.findUserByJwtToken(authHeader);
        Customer customer = customerService.findCustomerByEmail(user.getEmail());
        List<Order> orders = orderRepository.findByCustomer_CustomerId(customer.getCustomerId());
        return orders.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    @Override
    public OrderDTO convertToDto(Order order) {
        OrderDTO dto = new OrderDTO();
        dto.setOrderDate(order.getOrderDate());
        dto.setOrderAmount(order.getOrderAmount());
        dto.setShippingDate(order.getShippingDate());
        dto.setOrderStatus(order.getOrderStatus().name());
        dto.setRazorpayOrderId(order.getRazorpayOrderId());
        dto.setRazorpayPaymentId(order.getRazorpayPaymentId());
        dto.setShippingMethod(order.getShippingMethod());

        // Set shipping address
        AddressDTO addressDTO = addressService.convertToAddressDTO(order.getShippingAddress());
        dto.setShippingAddress(addressDTO);

        // Set order items
        Set<OrderItemDTO> itemDTOs = order.getOrderItems().stream()
                .map(item -> {
                    OrderItemDTO itemDTO = new OrderItemDTO();
                    itemDTO.setId(item.getId());
                    itemDTO.setProductId(item.getProductId());
                    itemDTO.setQuantity(item.getQuantity());
                    itemDTO.setPrice(item.getPrice());
                    itemDTO.setImageUrl(item.getImageUrl());
                    itemDTO.setTotalPrice(item.getTotalPrice());
                    return itemDTO;
                })
                .collect(Collectors.toSet());
        dto.setOrderItems(itemDTOs);

        return dto;
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
