package com.learning.NrCreation.Controller;

import com.learning.NrCreation.Entity.User;
import com.learning.NrCreation.Repository.AddressRepository;
import com.learning.NrCreation.Request.RoleUpdateRequest;
import com.learning.NrCreation.Request.UpdateUserProfileRequest;
import com.learning.NrCreation.Response.ApiResponse;
import com.learning.NrCreation.Response.PagedResponse;
import com.learning.NrCreation.Response.UserDTO;
import com.learning.NrCreation.Service.User.UserService;
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
    private final UserService userService;
    private final AddressRepository addressRepository;

    @PreAuthorize("hasAnyAuthority('admin:read','user:read')")
    @GetMapping("/get-user-profile")
    public ResponseEntity<ApiResponse> getUserProfile(@RequestHeader("Authorization") String authHeader) {
        User user = userService.findUserByJwtToken(authHeader);
        UserDTO userDTO = userService.convertToDtoResponse(user);
        return new ResponseEntity<>(new ApiResponse("User Fetched!",userDTO), HttpStatus.OK);
    }

    @PreAuthorize("hasAnyAuthority('admin:update','user:update')")
    @PutMapping("/update-user-profile")
    public ResponseEntity<ApiResponse> updateUserProfile(@RequestHeader("Authorization") String authHeader,@Valid @RequestBody UpdateUserProfileRequest request) {
//        System.out.println(authHeader);
        User user = userService.findUserByJwtToken(authHeader);

        UserDTO userDTO = userService.convertToDtoResponse(userService.updateUser(request,user.getEmail()));
        return new ResponseEntity<>(new ApiResponse("User Profile Updated!",userDTO), HttpStatus.OK);
    }

    @PreAuthorize("hasAnyAuthority('admin:read')")
    @GetMapping("/get-all")
    public ResponseEntity<?> getAllUsers(
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

        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, "id")); // primary key in User entity
        Page<User> userPage = userService.getUsersBySearchFilterSort(search, birthYear, city, state, pageable);

        List<UserDTO> userDTOs = userPage.getContent()
                .stream()
                .map(userService::convertToDtoResponse) // direct mapping to DTO
                .toList();

        PagedResponse<UserDTO> response = new PagedResponse<>(
                "All Users Fetched!", userDTOs, userPage
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
