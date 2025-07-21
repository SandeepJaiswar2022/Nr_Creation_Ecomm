package com.learning.NrCreation.Controller;

import com.cloudinary.Api;
import com.learning.NrCreation.Entity.Customer;
import com.learning.NrCreation.Entity.Order;
import com.learning.NrCreation.Entity.User;
import com.learning.NrCreation.Enum.OrderStatus;
import com.learning.NrCreation.Repository.CustomerRepository;
import com.learning.NrCreation.Request.CreateOrderRequest;
import com.learning.NrCreation.Request.PaymentVerificationRequest;
import com.learning.NrCreation.Response.ApiResponse;
import com.learning.NrCreation.Response.OrderDTO;
import com.learning.NrCreation.Response.PagedResponse;
import com.learning.NrCreation.Service.Order.OrderService;
import com.learning.NrCreation.Service.Razorpay.RazorpayService;
import com.learning.NrCreation.Service.User.UserService;
import com.razorpay.RazorpayException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.math.BigDecimal;
import java.time.LocalDate;
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
    @PreAuthorize("hasAnyAuthority('user:create')")
    public ResponseEntity<ApiResponse> createOrder(@RequestHeader("Authorization") String authHeader, @RequestBody CreateOrderRequest orderRequest) throws RazorpayException {
        Map<String, String> orderResponse = orderService.createOrder(authHeader, orderRequest);
        return new ResponseEntity<>(new ApiResponse("Order Creation Initiated!", orderResponse)
                , HttpStatus.OK);
    }

    @GetMapping("/{orderId}")
    @PreAuthorize("hasAnyAuthority('admin:read','user:read')")
    public ResponseEntity<ApiResponse> getOrder(@PathVariable Long orderId) {
        OrderDTO orderDTO = orderService.convertToDto(orderService.getOrderById(orderId));
        return new ResponseEntity<>(new ApiResponse("Order Fetched!", orderDTO)
                , HttpStatus.OK);
    }

    @DeleteMapping("/{orderId}")
    @PreAuthorize("hasAnyAuthority('admin:delete')")
    public ResponseEntity<ApiResponse> deleteOrderByOrderId(@PathVariable Long orderId) {
        orderService.deleteOrderById(orderId);
        return new ResponseEntity<>(new ApiResponse("Order Deleted!", null)
                , HttpStatus.OK);
    }


@GetMapping("/my-orders")
@PreAuthorize("hasAnyAuthority('user:read')")
public ResponseEntity<?> getMyOrders(
        @RequestHeader("Authorization") String authHeader,
        @RequestParam(required = false) String search,
        @RequestParam(required = false) OrderStatus status,
        @RequestParam(required = false) String shippingMethod,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
        @RequestParam(defaultValue = "0") BigDecimal priceLow,
        @RequestParam(defaultValue = "1000000") BigDecimal priceHigh,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "desc") String sortDir
) {
    System.out.println("\n\nIn get my orders=======");
    System.out.println("search: " + search);
    System.out.println("status: " + status);
    System.out.println("shippingMethod: " + shippingMethod);
    System.out.println("startDate: " + startDate);
    System.out.println("endDate: " + endDate);
    System.out.println("priceLow: " + priceLow);
    System.out.println("priceHigh: " + priceHigh);
    System.out.println("page: " + page);
    System.out.println("size: " + size);
    System.out.println("sortDir: " + sortDir);
    System.out.println("In get my orders=======\n\n");
    int maxPageSize = 50;
    if (size > maxPageSize) size = maxPageSize;

    Sort.Direction direction = Sort.Direction.fromString(sortDir);
    Pageable pageable = PageRequest.of(page, size, Sort.by(direction, "orderDate"));

    Page<OrderDTO> ordersPage = orderService.getParticularCustomerAllOrders(authHeader,search, status, shippingMethod, startDate, endDate, priceLow, priceHigh, pageable);

    PagedResponse<OrderDTO> response = new PagedResponse<>("Orders Fetched!", ordersPage.getContent(), ordersPage);
    return new ResponseEntity<>(response, HttpStatus.OK);
}


    @GetMapping("/all-orders")
    @PreAuthorize("hasAnyAuthority('admin:read')")
    public ResponseEntity<?> getAllOrders(
            @RequestParam(required = false) OrderStatus status,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String shippingMethod,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "0") BigDecimal low,
            @RequestParam(defaultValue = "1000000") BigDecimal high,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        int maxPageSize = 50;
        if (size > maxPageSize) size = maxPageSize;

        Sort.Direction direction = Sort.Direction.fromString(sortDir);
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, "orderDate"));

        Page<OrderDTO> ordersPage = orderService.getAllOrders(search,status, shippingMethod, startDate, endDate, low, high, pageable);

        PagedResponse<OrderDTO> response = new PagedResponse<>("All Orders Fetched!", ordersPage.getContent(), ordersPage);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }


    @PostMapping("/verify-payment")
    @PreAuthorize("hasAnyAuthority('user:create')")
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