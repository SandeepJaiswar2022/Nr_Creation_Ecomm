package com.learning.NrCreation.Response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PaymentDTO {
    private Long paymentId;
    private Long orderId; // Instead of Order object, just send the ID
    private String customerEmail;
    private String paymentMode;
    private Date dateOfPayment;
}
