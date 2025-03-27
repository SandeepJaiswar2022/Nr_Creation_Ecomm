package com.learning.NrCreation.Controller;

import com.learning.NrCreation.Entity.Order;
import com.learning.NrCreation.Exception.ResourceNotFoundException;
import com.learning.NrCreation.Response.ApiResponse;
import com.learning.NrCreation.Response.OrderDTO;
import com.learning.NrCreation.Service.Order.OrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("${api.prefix}/order")
@PreAuthorize("hasAnyRole('ADMIN','USER')")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;

    @PreAuthorize("hasAuthority('user:create')")
    @PostMapping
    public ResponseEntity<ApiResponse> createOrder(@RequestParam Long userId)
    {
        try {
            log.debug("Create order");
            Order order =orderService.placeOrder(userId);
            log.info("Order fetched successfully");
            OrderDTO orderDTO = orderService.convertToDto(order);
            return new ResponseEntity<>(new ApiResponse("Order Created Successfully", orderDTO),
                    HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>
                    (new ApiResponse("Error Occurred!: "+e.getMessage(), null)
                            ,HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping
    public ResponseEntity<ApiResponse> getOrderById(@RequestParam Long orderId)
    {
        try {
            OrderDTO orderDTO = orderService.getOrder(orderId);
            return new ResponseEntity<>(new ApiResponse("Order Fetched Successfulyy", orderDTO),
                    HttpStatus.CREATED);

        } catch (ResourceNotFoundException e) {
            return new ResponseEntity<>
                    (new ApiResponse(e.getMessage(), null)
                            ,HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("get-user-orders")
    public ResponseEntity<ApiResponse> getUserOrders(@RequestParam Long userId)
    {
        try {
            List<OrderDTO> orders = orderService.getUserOrders(userId);
            if(orders.isEmpty())
            {
                return new ResponseEntity<>(new ApiResponse("No order found for user with id : "+userId, orders),
                        HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(new ApiResponse("Order Fetched Successfulyy", orders),
                    HttpStatus.OK);

        } catch (ResourceNotFoundException e) {
            return new ResponseEntity<>
                    (new ApiResponse(e.getMessage(), null)
                            ,HttpStatus.NOT_FOUND);
        }
    }
}