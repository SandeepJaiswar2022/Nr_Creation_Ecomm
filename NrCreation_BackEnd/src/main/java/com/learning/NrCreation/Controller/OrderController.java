package com.learning.NrCreation.Controller;

import com.learning.NrCreation.Entity.Order;
import com.learning.NrCreation.Entity.User;
import com.learning.NrCreation.Repository.CustomerRepository;
import com.learning.NrCreation.Request.PaymentVerificationRequest;
import com.learning.NrCreation.Response.OrderDTO;
import com.learning.NrCreation.Service.Order.OrderService;
import com.learning.NrCreation.Service.User.UserService;
import com.razorpay.RazorpayException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("${api.prefix}/orders")
@PreAuthorize("hasAnyRole('ADMIN','USER')")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;
    private final UserService userService;
    private final CustomerRepository customerRepo;

    @PostMapping("/place")
    public ResponseEntity<OrderDTO> placeOrder(@RequestParam("Authorization") String accessToken, @RequestBody Map<String , Object> orderRequest) throws RazorpayException {
        System.out.println(accessToken + " Access Token Found");
        User user = userService.findUserByJwtToken(accessToken);
        System.out.println(user + " User Found");
        System.out.println(orderRequest + " Order Request Found");
        Order order = orderService.placeOrder(user.getId(), orderRequest);
        return ResponseEntity.ok(orderService.convertToDto(null));
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<OrderDTO> getOrder(@PathVariable Long orderId) {
        return ResponseEntity.ok(orderService.getOrderById(orderId));
    }

    @PostMapping("/verify-payment")
    public ResponseEntity<String> verifyPayment(@RequestBody PaymentVerificationRequest request) throws RazorpayException {
        orderService.verifyPayment(request.getOrderId(),
                request.getRazorpayPaymentId(),
                request.getRazorpayOrderId(),
                request.getRazorpaySignature());
        return ResponseEntity.ok("Payment verified successfully");
    }
}