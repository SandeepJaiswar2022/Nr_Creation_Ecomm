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
    private String address1;
    private String address2;
    private String city;
    private String state;
    private String pinCode;
    private String country;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;
}