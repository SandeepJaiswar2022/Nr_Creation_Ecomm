package com.learning.NrCreation.Response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderItemDTO {
    private Long id;
    private Long productId;
    private Integer quantity;
    private BigDecimal price; // Discounted price per unit
    private BigDecimal originalPrice; // Original price per unit

    // Calculate discount for this item
    public BigDecimal getDiscount() {
        if (originalPrice == null || price == null) {
            return BigDecimal.ZERO;
        }
        return originalPrice.subtract(price).multiply(BigDecimal.valueOf(quantity));
    }
}
