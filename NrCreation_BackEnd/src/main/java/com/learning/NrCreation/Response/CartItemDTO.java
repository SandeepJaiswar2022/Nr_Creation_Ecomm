package com.learning.NrCreation.Response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CartItemDTO {
	private Long itemId;
    private Integer quantity;
    private BigDecimal unitPrice;
    private Long productId;
    private String imageUrl;
    private BigDecimal totalPrice;
}
