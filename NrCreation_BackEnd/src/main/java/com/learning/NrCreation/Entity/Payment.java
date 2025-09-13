package com.learning.NrCreation.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Setter
@Getter
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String razorpayPaymentId;
    private String razorpayOrderId;
    private BigDecimal amount;
    private String status; // e.g., "created", "captured", "failed"

    private LocalDateTime paymentDate;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false) // foreign key column pointing to AppUser.id
    private User user;

    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;
}