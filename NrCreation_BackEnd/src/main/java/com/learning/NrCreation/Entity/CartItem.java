package com.learning.NrCreation.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Setter
@Getter
@NoArgsConstructor
public class CartItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer quantity;

    private BigDecimal unitPrice;

    private BigDecimal totalPrice;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    @JsonIgnore
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "cart_id")
    private Cart cart;

//    public void computeAndSetTotalPrice() {
//        this.totalPrice = this.unitPrice.multiply(new BigDecimal(quantity));
//    }
public void computeAndSetTotalPrice() {
    if (unitPrice == null || quantity == null) {
        this.totalPrice = BigDecimal.ZERO;
    } else {
        this.totalPrice = unitPrice.multiply(BigDecimal.valueOf(quantity));
    }
}

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
        computeAndSetTotalPrice();
    }

    public void setUnitPrice(BigDecimal unitPrice) {
        this.unitPrice = unitPrice;
        computeAndSetTotalPrice();
    }
}