package com.learning.NrCreation.Controller;

import com.learning.NrCreation.Entity.Customer;
import com.learning.NrCreation.Entity.User;
import com.learning.NrCreation.Repository.AddressRepository;
import com.learning.NrCreation.Repository.CustomerRepository;
import com.learning.NrCreation.Request.RoleUpdateRequest;
import com.learning.NrCreation.Response.ApiResponse;
import com.learning.NrCreation.Response.PagedResponse;
import com.learning.NrCreation.Response.UserDTO;
import com.learning.NrCreation.Service.Customer.CustomerService;
import com.learning.NrCreation.Service.User.UserServiceImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;

@Validated
@RestController
@PreAuthorize("hasAnyRole('ADMIN','USER')")
@RequestMapping("${api.prefix}/user")
@RequiredArgsConstructor
public class UserController {
    private final UserServiceImpl userService;
    private final CustomerService customerService;
    private final AddressRepository addressRepository;

    @PreAuthorize("hasAnyAuthority('admin:read','user:read')")
    @GetMapping("/get-user-profile")
    public ResponseEntity<ApiResponse> getUserProfile(@RequestHeader("Authorization") String authHeader) {
        System.out.println(authHeader);
        User user = userService.findUserByJwtToken(authHeader);
        UserDTO userDTO = userService.convertToDtoResponse(user);
        return new ResponseEntity<>(new ApiResponse("User Fetched!",userDTO), HttpStatus.OK);
    }

    @PreAuthorize("hasAnyAuthority('admin:read')")
    @GetMapping("/get-all")
    public ResponseEntity<?> getAllCustomers(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Integer birthYear,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String state,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "asc") String sortDir
    ) {
        int maxPageSize = 50;
        if (size > maxPageSize) size = maxPageSize;

        Sort.Direction direction;
        try {
            direction = Sort.Direction.fromString(sortDir);
        } catch (IllegalArgumentException | NullPointerException e) {
            direction = Sort.Direction.ASC;
        }

        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, "customerId")); // Or another field
        Page<Customer> customerPage = customerService.getCustomersBySearchFilterSort(search, birthYear, city, state, pageable);

        List<UserDTO> userDTOs = customerPage.getContent()
                .stream()
                .map(Customer::getEmail)
                .distinct() // in case multiple customers have same email
                .map(userService::getUserByEmail) // implement safely
                .filter(Objects::nonNull)
                .map(userService::convertToDtoResponse)
                .toList();

        PagedResponse<UserDTO> response = new PagedResponse<>(
                "All Customers Fetched!", userDTOs, customerPage
        );
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PreAuthorize("hasAnyAuthority('admin:update')")
    @PutMapping("/update-role")
    public ResponseEntity<ApiResponse> updateUserRole(@Valid @RequestBody RoleUpdateRequest request) {
        userService.changeUserRole(request.getUserEmail(),request.getRole());
        return new ResponseEntity<>(new ApiResponse("Role Changed Successfully!",null), HttpStatus.OK);
    }

}
