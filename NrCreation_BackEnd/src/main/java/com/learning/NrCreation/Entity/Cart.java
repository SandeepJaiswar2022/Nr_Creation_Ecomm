package com.learning.NrCreation.Entity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Cart {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long cartId;

    private BigDecimal totalAmount = BigDecimal.ZERO;

    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<CartItem> items = new HashSet<>();

    @OneToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;

    public void addItem(CartItem item) {
        this.items.add(item);
        item.setCart(this);
        getTotalAmount();
    }

    public void removeItem(CartItem item) {
        this.items.remove(item);
        item.setCart(null);
        getTotalAmount();
    }


    public BigDecimal getTotalAmount() {
        return this.totalAmount = items.stream().map(item -> {
            BigDecimal unitPrice = item.getUnitPrice();
            if (unitPrice == null) {
                return  BigDecimal.ZERO;
            }
            return unitPrice.multiply(BigDecimal.valueOf(item.getQuantity()));
        }).reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
