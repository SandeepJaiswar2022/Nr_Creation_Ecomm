package com.learning.NrCreation.Controller;

import com.learning.NrCreation.Entity.Customer;
import com.learning.NrCreation.Entity.Order;
import com.learning.NrCreation.Entity.User;
import com.learning.NrCreation.Repository.CustomerRepository;
import com.learning.NrCreation.Request.CreateOrderRequest;
import com.learning.NrCreation.Request.PaymentVerificationRequest;
import com.learning.NrCreation.Response.ApiResponse;
import com.learning.NrCreation.Response.OrderDTO;
import com.learning.NrCreation.Service.Order.OrderService;
import com.learning.NrCreation.Service.User.UserService;
import com.razorpay.RazorpayException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.Map;
import java.util.Optional;

@Slf4j
@RestController
@RequestMapping("${api.prefix}/orders")
@PreAuthorize("hasAnyRole('ADMIN','USER')")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;


    @PostMapping("/place")
    public ResponseEntity<?> createOrder(@RequestHeader("Authorization") String authHeader, @RequestBody CreateOrderRequest orderRequest) throws RazorpayException {
        Map<String, String> orderResponse = orderService.createOrder(authHeader, orderRequest);
        return new ResponseEntity<>(new ApiResponse("Order Creation Initiated!", orderResponse)
                , HttpStatus.OK);

    }

    @GetMapping("/{orderId}")
    public ResponseEntity<OrderDTO> getOrder(@PathVariable Long orderId) {
        return ResponseEntity.ok(orderService.getOrderById(orderId));
    }

//    @PostMapping("/verify-payment")
//    public ResponseEntity<String> verifyPayment(@RequestBody PaymentVerificationRequest request) throws RazorpayException {
//        orderService.verifyPayment(request.getOrderId(),
//                request.getRazorpayPaymentId(),
//                request.getRazorpayOrderId(),
//                request.getRazorpaySignature());
//        return ResponseEntity.ok("Payment verified successfully");
//    }
}