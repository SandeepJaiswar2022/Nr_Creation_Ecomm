package com.learning.NrCreation.Response;

import com.learning.NrCreation.Enum.OrderStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderStatusUpdateDTO {
    @NotNull(message = "Order ID cannot be null")
    private Long orderId;

    @NotNull(message = "Order status is required")
    private String orderStatus;
}
