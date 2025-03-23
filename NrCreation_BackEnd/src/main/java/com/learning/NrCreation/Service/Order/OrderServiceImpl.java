package com.learning.NrCreation.Service.Order;

import com.learning.NrCreation.Entity.Cart;
import com.learning.NrCreation.Entity.Order;
import com.learning.NrCreation.Entity.OrderItem;
import com.learning.NrCreation.Entity.Product;
import com.learning.NrCreation.Enum.OrderStatus;
import com.learning.NrCreation.Exception.ResourceNotFoundException;
import com.learning.NrCreation.Repository.OrderItemRepository;
import com.learning.NrCreation.Repository.OrderRepository;
import com.learning.NrCreation.Repository.ProductRepository;
import com.learning.NrCreation.Response.OrderDTO;
import com.learning.NrCreation.Response.OrderItemDTO;
import com.learning.NrCreation.Service.Cart.CartService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {
    private final ProductRepository productRepo;
    private final CartService cartService;
    private final OrderRepository orderRepo;
    private final OrderItemRepository orderItemRepo;

    @Transactional
    @Override
    public Order placeOrder(Long userId) {

        Cart cart = cartService.getCartByUserId(userId);

        Order order = createOrder(cart);
        cartService.clearCart(cart.getCartId());
        return order;
    }

    @Override
    public OrderDTO getOrder(Long orderId) {
        return orderRepo.findById(orderId)
                .map(this::convertToDto)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
    }

    @Override
    public List<OrderDTO> getUserOrders(Long userId) {
        List<Order> orders = orderRepo.findByCustomer_CustomerId(userId);
        return orders.stream().map(this :: convertToDto).toList();
    }

    @Transactional
    public Order createOrder(Cart cart)
    {

        // Step 1: Save Order first
        Order order = new Order();
        order.setOrderDate(LocalDate.now());
        order.setOrderStatus(OrderStatus.PENDING);
        order.setCustomer(cart.getCustomer());
        order.setOrderAmount(BigDecimal.ZERO); // Temporary amount

        order = orderRepo.save(order);

        List<OrderItem> orderItemList = createOrderItems(order, cart);
        BigDecimal totalAmount = calculateTotalAmount(orderItemList);
        order.setOrderAmount(totalAmount);
        order.setOrderItems(new HashSet<>(orderItemList));
        System.out.println("\ncreate Order Called\n");
        return orderRepo.save(order);
    }

    private List<OrderItem> createOrderItems(Order order, Cart cart)
    {
        System.out.println("\nCreate Order Items\n");
        return cart.getItems().stream()
                .map(cartItem -> {
                    Product product = cartItem.getProduct();
                    product.setInventory(product.getInventory() - cartItem.getQuantity());
                    productRepo.save(product);
                    OrderItem orderItem = new OrderItem();
                    orderItem.setOrder(order);
                    orderItem.setProduct(product);
                    orderItem.setQuantity(cartItem.getQuantity());
                    orderItem.setPrice(cartItem.getUnitPrice());

                    return orderItemRepo.save(orderItem);
                })
                .toList();
    }

    private BigDecimal calculateTotalAmount(List<OrderItem> orderItems)
    {
        return orderItems.stream().map(item -> item.getPrice()
                .multiply(new BigDecimal(item.getQuantity()))
        ).reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    @Override
    public OrderDTO convertToDto(Order order) {
        return new OrderDTO(order.getOrderId(),order.getCustomer().getCustomerId(),
                order.getOrderDate(),
                order.getOrderAmount(),
                order.getOrderStatus().name(),
                (order.getOrderItems()==null || order.getOrderItems().isEmpty())
                        ? Collections.emptyList() : order.getOrderItems()
                        .stream()
                        .map(item -> new OrderItemDTO(item.getProduct().getId(),
                                item.getProduct().getName(),
                                item.getQuantity(),item.getPrice())).collect(Collectors.toList()));
    }

}
