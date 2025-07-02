package com.learning.NrCreation.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long productId;
    private String productName;
    private Integer quantity;
    private BigDecimal price; // Discounted price per unit
    private BigDecimal totalPrice;
    private String imageUrl;

    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;
}
