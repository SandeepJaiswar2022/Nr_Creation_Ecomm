package com.learning.NrCreation.Controller;

import com.learning.NrCreation.Entity.User;
import com.learning.NrCreation.Response.ApiResponse;
import com.learning.NrCreation.Response.UserDTO;
import com.learning.NrCreation.Service.User.UserServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@PreAuthorize("hasAnyRole('ADMIN','USER')")
@RequestMapping("${api.prefix}/get-user-profile")
@RequiredArgsConstructor
public class UserController {
    private final UserServiceImpl userServiceImpl;

    @PreAuthorize("hasAnyAuthority('admin:read','user:read')")
    @GetMapping
    public ResponseEntity<ApiResponse> getUserProfile(@RequestHeader("Authorization") String authHeader) {
        System.out.println(authHeader);
        User user = userServiceImpl.findUserByJwtToken(authHeader);
        UserDTO userDTO = userServiceImpl.convertToDtoResponse(user);
        return new ResponseEntity<>(new ApiResponse("User Fetched!",userDTO), HttpStatus.OK);
    }
}
