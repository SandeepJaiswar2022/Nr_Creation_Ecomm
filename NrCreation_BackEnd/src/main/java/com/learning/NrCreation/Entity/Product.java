package com.learning.NrCreation.Entity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String brand;

    private BigDecimal price;

    private Integer inventory;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    private String description;

    @ElementCollection
    private List<String> imageUrls = new ArrayList<>();

    //Constructor
    public Product(String name, String brand, BigDecimal price,
                   Integer inventory, Category category, String description) {
        this.name = name;
        this.brand = brand;
        this.price = price;
        this.inventory = inventory;
        this.category = category;
        this.description = description;
    }
}