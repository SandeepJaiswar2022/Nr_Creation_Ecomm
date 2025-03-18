package com.learning.NrCreation.Response;

import com.learning.NrCreation.Enum.PaymentMode;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
public class PaymentDTO {
    private Long paymentId;
    private Long orderId; // Instead of Order object, just send the ID
    private String customerEmail;
    private String paymentMode;
    private Date dateOfPayment;
}
