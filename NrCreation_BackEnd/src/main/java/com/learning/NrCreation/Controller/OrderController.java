package com.learning.NrCreation.Controller;

import com.cloudinary.Api;
import com.learning.NrCreation.Entity.Customer;
import com.learning.NrCreation.Entity.Order;
import com.learning.NrCreation.Entity.User;
import com.learning.NrCreation.Repository.CustomerRepository;
import com.learning.NrCreation.Request.CreateOrderRequest;
import com.learning.NrCreation.Request.PaymentVerificationRequest;
import com.learning.NrCreation.Response.ApiResponse;
import com.learning.NrCreation.Response.OrderDTO;
import com.learning.NrCreation.Service.Order.OrderService;
import com.learning.NrCreation.Service.Razorpay.RazorpayService;
import com.learning.NrCreation.Service.User.UserService;
import com.razorpay.RazorpayException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Slf4j
@RestController
@RequestMapping("${api.prefix}/orders")
@PreAuthorize("hasAnyRole('ADMIN','USER')")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;
    private final RazorpayService razorpayService;


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

    @GetMapping("/my-orders")
    public ResponseEntity<ApiResponse> getMyOrders(@RequestHeader("Authorization") String authHeader) {
        List<OrderDTO> allOrders = orderService.getParticularCustomerAllOrders(authHeader);
        return new ResponseEntity<>(new ApiResponse("Orders Fetched!", allOrders)
                , HttpStatus.OK);
    }


    @PostMapping("/verify-payment")
    public ResponseEntity<ApiResponse> verifyPayment(@RequestBody PaymentVerificationRequest request) {
//        System.out.println("\n\nVerify payment request: " + request);
        Boolean isPaymentVerified = razorpayService.verifyPayment(request);

        Map<String,Object> response = new HashMap<>();
        response.put("isPaymentVerified", isPaymentVerified);
        String message = isPaymentVerified ? "Payment verified!" : "Payment not verified!";

        return isPaymentVerified ? new ResponseEntity<>(new ApiResponse(message, response)
                , HttpStatus.OK) : new ResponseEntity<>(new ApiResponse(message, response), HttpStatus.BAD_REQUEST) ;
    }
}