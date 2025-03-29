package com.learning.NrCreation.Controller;

import com.learning.NrCreation.Entity.Customer;
import com.learning.NrCreation.Entity.Order;
import com.learning.NrCreation.Entity.User;
import com.learning.NrCreation.Exception.ResourceNotFoundException;
import com.learning.NrCreation.Repository.CustomerRepository;
import com.learning.NrCreation.Response.ApiResponse;
import com.learning.NrCreation.Response.OrderDTO;
import com.learning.NrCreation.Service.Order.OrderService;
import com.learning.NrCreation.Service.User.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Optional;

@Slf4j
@RestController
@RequestMapping("${api.prefix}/order")
@PreAuthorize("hasAnyRole('ADMIN','USER')")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;
    private final UserService userService;
    private final CustomerRepository customerRepo;

    @PreAuthorize("hasAnyAuthority('admin:read','user:read')")
    @PostMapping("create")
    public ResponseEntity<ApiResponse> createOrder(@RequestHeader("Authorization") String authHeader)
    {
        try {
            log.debug("Create order");
            User user = userService.findUserByJwtToken(authHeader);
            Optional<Customer> customer = customerRepo.findByEmail(user.getEmail());
            if (customer.isEmpty()) {
                return new ResponseEntity<>(new ApiResponse("Customer not found with email : "+user.getEmail(), null)
                        ,HttpStatus.NOT_FOUND);
            }
            Order order =orderService.placeOrder(customer.get().getCustomerId());
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
    @PreAuthorize("hasAnyAuthority('admin:read','user:read')")
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
    @PreAuthorize("hasAnyAuthority('admin:read','user:read')")
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

    //Have to implement get all the Orders of all the users
}