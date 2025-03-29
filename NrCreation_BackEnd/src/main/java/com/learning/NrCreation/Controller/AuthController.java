package com.learning.NrCreation.Controller;


import com.learning.NrCreation.Entity.Product;
import com.learning.NrCreation.Request.LoginRequest;
import com.learning.NrCreation.Request.RegisterRequest;
import com.learning.NrCreation.Response.ApiResponse;
import com.learning.NrCreation.Response.AuthResponse;
import com.learning.NrCreation.Response.ProductDTO;
import com.learning.NrCreation.Service.Auth.AuthService;
import com.learning.NrCreation.Service.Product.ProductService;
import jakarta.validation.Valid;
import lombok.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@Validated
@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/auth")
public class AuthController {
	private final AuthService authService;

	//Only this End Point's Exceptions are getting handled by the GlobalExceptionHandler
	
	@PostMapping("/register")
	public ResponseEntity<ApiResponse> register(@Valid @RequestBody RegisterRequest request)
	{
		AuthResponse authResponse = authService.register(request);
			
		return new ResponseEntity<>(new ApiResponse(
				"Registered Succesfully ",authResponse),HttpStatus.OK);
	}

	@PostMapping("/login")
    public ResponseEntity<ApiResponse> authenticate(@RequestBody LoginRequest request) {
		
		try {
			AuthResponse authResponse = authService.login(request);
			return new ResponseEntity<>(new ApiResponse("Logged In Successfully",authResponse)
					,HttpStatus.OK);	
		} catch (Exception e) {
			return new ResponseEntity<>(new ApiResponse(e.getMessage(),null)
					,HttpStatus.BAD_REQUEST);
		}
    }

}
