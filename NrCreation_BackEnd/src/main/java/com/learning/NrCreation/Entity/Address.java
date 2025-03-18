package com.learning.NrCreation.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long addressId;

    private String apartNo;
    private String apartName;
    private String streetName;
    private String state;
    private String city;
    private Integer pincode;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;
}