package com.learning.NrCreation.Response;

import com.learning.NrCreation.Enum.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderDTO {
	private Long orderId;
    private Long userId;
    private Date orderDate;
    private BigDecimal totalAmount;
    private String orderStatus;
    private List<OrderItemDTO> items;
}
