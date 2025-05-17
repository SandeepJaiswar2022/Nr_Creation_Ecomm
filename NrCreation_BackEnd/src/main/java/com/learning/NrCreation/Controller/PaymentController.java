package com.learning.NrCreation.Controller;

import com.learning.NrCreation.Entity.User;
import com.learning.NrCreation.Exception.OrderException;
import com.learning.NrCreation.Response.OrderDTO;
import com.learning.NrCreation.Response.PaymentResponse;
import com.learning.NrCreation.Service.Auth.JwtServiceImpl;
import com.learning.NrCreation.Service.Order.OrderServiceImpl;
import com.learning.NrCreation.Service.User.UserService;
import com.razorpay.*;
import com.learning.NrCreation.Response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/payment")
public class PaymentController {
    @Value("${razorpay.api.key}")
    private String apiKey;
    @Value("${razorpay.api.secret}")
    private String apiSecret;

    private final OrderServiceImpl orderService;
    private final JwtServiceImpl jwtService ;
    private final UserService userService;

    @PostMapping("/payment/{orderId}")
    @PreAuthorize("hasAuthority('user:create')")
    public ResponseEntity<PaymentResponse> createPaymentLink(
            @PathVariable Long orderId, @RequestHeader("Authorization") String authHeader)
            throws OrderException, RazorpayException {
        OrderDTO order = orderService.getOrderById(orderId);
        try {
            String userEmail = jwtService.extractUsername(authHeader);
            User user = userService.getUserByEmail(userEmail);
            RazorpayClient razorpay = new RazorpayClient(apiKey, apiSecret);
            JSONObject customer = new JSONObject();
            customer.put("name", user.getFirstName());
            customer.put("email", user.getEmail());

            JSONObject notify = new JSONObject();
            notify.put("sms", true);
            notify.put("email", true);

            JSONObject paymentLinkRequest = new JSONObject();
            int amount = order.getTotalDiscountPrice().setScale(0, RoundingMode.FLOOR).intValue();
            System.out.println("\n\n\nAmount : " + amount+"\n\n\n");
            long amountInPaise = amount * 100L;
            paymentLinkRequest.put("amount", amountInPaise);
            paymentLinkRequest.put("accept_partial", false);
            paymentLinkRequest.put("first_min_partial_amount", amountInPaise);
            paymentLinkRequest.put("currency", "INR");
            paymentLinkRequest.put("notify", notify);
            paymentLinkRequest.put("customer", customer);
            paymentLinkRequest.put("callback_url", "http://localhost:5176/postordersummary/"+orderId);
            paymentLinkRequest.put("callback_method", "get");

            PaymentLink paymentLink = razorpay.paymentLink.create(paymentLinkRequest); //client.create.order(pymntrequest)

            String paymentLinkId = paymentLink.get("id");
            String paymentLinkURL = paymentLink.get("short_url");

            PaymentResponse paymentResponse = new PaymentResponse();
            paymentResponse.setPaymentLinkId(paymentLinkId);
            paymentResponse.setPaymentLinkURL(paymentLinkURL);
            return new ResponseEntity<PaymentResponse>(paymentResponse, HttpStatus.CREATED);

        } catch (RazorpayException e) {
            throw new RazorpayException(e.getMessage());
        }
    }


    @GetMapping("/payment")
    @PreAuthorize("hasAuthority('user:create')")
    public ResponseEntity<ApiResponse> redirect(
            @RequestParam(name = "paymentId") String paymentId,
            @RequestParam(name = "orderId") Long orderId
    ) throws RazorpayException {
        OrderDTO order = orderService.getOrderById(orderId);
        RazorpayClient razorpay = new RazorpayClient(apiKey, apiSecret);

        Payment payment = razorpay.payments.fetch(paymentId);
        if (payment.get("status").equals("captured")) {
            String paymentMethod = payment.get("method");
            Integer amountPaid = payment.get("amount");
            String amountPaidString = String.valueOf(amountPaid / 100.0); // Convert paise to rupees
            Date createdAtDate = new Date((Integer) payment.get("created_at") * 1000L);
            LocalDateTime dateTime = createdAtDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
            String formattedDateTime = dateTime.format(formatter);

            // Update order via service
            orderService.verifyPayment(
                    orderId,
                    paymentId,
                    order.getRazorpayOrderId(),
                    null // Signature verification to be implemented
            );

            ApiResponse response = new ApiResponse();
            response.setData(true);
            response.setMessage("Payment successful, order confirmed");
            return new ResponseEntity<>(response, HttpStatus.ACCEPTED);
        } else {
            throw new RuntimeException("Payment not captured");
        }
    }
}