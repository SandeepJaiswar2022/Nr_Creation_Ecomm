package com.learning.NrCreation.Controller;

import com.learning.NrCreation.Entity.User;
import com.learning.NrCreation.Repository.AddressRepository;
import com.learning.NrCreation.Repository.CustomerRepository;
import com.learning.NrCreation.Request.RoleUpdateRequest;
import com.learning.NrCreation.Response.ApiResponse;
import com.learning.NrCreation.Response.UserDTO;
import com.learning.NrCreation.Service.User.UserServiceImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Validated
@RestController
@PreAuthorize("hasAnyRole('ADMIN','USER')")
@RequestMapping("${api.prefix}/user")
@RequiredArgsConstructor
public class UserController {
    private final UserServiceImpl userService;
    private final CustomerRepository customerRepository;
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
    public ResponseEntity<ApiResponse> getAllUsers() {
        List<User> users = userService.getAllUsers();
        List<UserDTO> userDTOs = userService.convertToDtoList(users);
        return new ResponseEntity<>(new ApiResponse("Users Fetched Successfully!",userDTOs), HttpStatus.OK);
    }

    @PreAuthorize("hasAnyAuthority('admin:update')")
    @PutMapping("/update-role")
    public ResponseEntity<ApiResponse> updateUserRole(@Valid @RequestBody RoleUpdateRequest request) {
        userService.changeUserRole(request.getUserEmail(),request.getRole());
        return new ResponseEntity<>(new ApiResponse("Role Changed Successfully!",null), HttpStatus.OK);
    }

}
