package com.learning.NrCreation.Response;

import com.learning.NrCreation.Entity.Address;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.ProblemDetail;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderDTO {
    private LocalDateTime orderDate;
    private BigDecimal orderAmount;
    private Long orderId;
    private Long customerId;
    private String customerName;
    private Date shippingDate;
    private String orderStatus;
    private String razorpayPaymentId;
    private String razorpayOrderId; // For frontend to initiate payment
    private Set<OrderItemDTO> orderItems;
    private AddressDTO shippingAddress;
    private String shippingMethod;
    // Calculate total discount across all order items
    public BigDecimal getTotalDiscountPrice() {
        if (orderItems == null || orderItems.isEmpty()) {
            return BigDecimal.ZERO;
        }
        return orderItems.stream()
                .map(OrderItemDTO::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }


}