package com.learning.NrCreation.Entity;

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
    private Long id;
    private String fullName;
    private String address;
    private String phone;
    private String city;
    private String state;
    private String pinCode;
    private String country;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false) // foreign key column pointing to AppUser.id
    private User user;
}