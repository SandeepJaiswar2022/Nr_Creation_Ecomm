package com.learning.NrCreation.Controller;

import com.learning.NrCreation.Response.ApiResponse;
import com.learning.NrCreation.Response.OrderDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/v1/order")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<ApiResponse> createOrder(@RequestParam Long userId)
    {
        try {
            OrderDTO orderDTO = orderService.convertToDto(orderService.placeOrder(userId));
            return new ResponseEntity<>(new ApiResponse("Order Created Successfulyy", orderDTO),
                    HttpStatus.CREATED);

        } catch (Exception e) {
            return new ResponseEntity<>
                    (new ApiResponse("Error Occured! : "+e.getMessage(), null)
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
