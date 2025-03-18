package com.learning.NrCreation.Entity;

import com.learning.NrCreation.Enum.PaymentMode;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long paymentId;

    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;

    @Enumerated(EnumType.STRING)
    private PaymentMode paymentMode;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;

    private Date dateOfPayment;
}