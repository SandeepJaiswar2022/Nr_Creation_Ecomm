package com.learning.NrCreation.Response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class OrderItemDTO {
	private Long productId;
    private String productName;
    private int quantity;
    private BigDecimal unitPrice;
}
