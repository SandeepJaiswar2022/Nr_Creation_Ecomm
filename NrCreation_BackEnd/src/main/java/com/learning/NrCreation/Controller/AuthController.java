package com.learning.NrCreation.Controller;


import com.cloudinary.Api;
import com.learning.NrCreation.Entity.Product;
import com.learning.NrCreation.Exception.InvalidInputException;
import com.learning.NrCreation.Request.LoginRequest;
import com.learning.NrCreation.Request.RegisterRequest;
import com.learning.NrCreation.Response.ApiResponse;
import com.learning.NrCreation.Response.AuthResponse;
import com.learning.NrCreation.Response.ProductDTO;
import com.learning.NrCreation.Service.Auth.AuthService;
import com.learning.NrCreation.Service.Product.ProductService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.*;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Validated
@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/auth")
public class AuthController {
	private final AuthService authService;

	//Only this End Point's Exceptions are getting handled by the GlobalExceptionHandler

	@PostMapping("/register")
	public ResponseEntity<ApiResponse> register(
			@Valid @RequestBody RegisterRequest request,
			HttpServletResponse response) {

		Map<String,Object> registerResponse = authService.register(request);

		// Send refresh token as HttpOnly cookie
		ResponseCookie cookie = ResponseCookie.from("refreshToken", registerResponse.get("refreshToken").toString())
				.httpOnly(true)
				.secure(true)
				.path("/")
				.maxAge(7 * 24 * 60 * 60) // 7 days
				.sameSite("Strict")
				.build();
		response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());


		AuthResponse authResponse = new AuthResponse(registerResponse.get("accessToken").toString(), registerResponse.get("user"));

		// Return only access token in body
		return ResponseEntity.ok(new ApiResponse("Registered Successfully",
				authResponse));
	}



	@PostMapping("/login")
	public ResponseEntity<ApiResponse> authenticate(
			@RequestBody LoginRequest request,
			HttpServletResponse response) {

		Map<String,Object> loginResponse = authService.login(request);

		// Send refresh token as HttpOnly cookie
		ResponseCookie cookie = ResponseCookie.from("refreshToken", loginResponse.get("refreshToken").toString())
				.httpOnly(true)
				.secure(true)
				.path("/")
				.maxAge(7 * 24 * 60 * 60) // 7 days
				.sameSite("Strict")
				.build();
		response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

		AuthResponse authResponse = new AuthResponse(loginResponse.get("accessToken").toString(), loginResponse.get("user"));

		// Return only access token in body
		return ResponseEntity.ok(new ApiResponse("Logged In Successfully",
				authResponse));
	}


	@PostMapping("/refresh-token")
	public ResponseEntity<ApiResponse> refreshAccessToken(HttpServletRequest request) {
		String refreshToken = null;

		// Extract refresh token from cookies
		if (request.getCookies() != null) {
			for (Cookie cookie : request.getCookies()) {
				if ("refreshToken".equals(cookie.getName())) {
					refreshToken = cookie.getValue();
					break;
				}
			}
		}

		if (refreshToken == null) {
			 throw new InvalidInputException("Refresh Token not Found!");
		}

		Map<String,Object> refreshTokenResponse = authService.refreshAccessToken(refreshToken);
		AuthResponse authResponse = new AuthResponse(refreshTokenResponse.get("accessToken").toString(), refreshTokenResponse.get("user"));
		return ResponseEntity.ok(new ApiResponse("Token refreshed successfully",
				authResponse));
	}


	@PostMapping("/logout")
	public ResponseEntity<ApiResponse> logout(@CookieValue(name = "refreshToken", required = false) String refreshToken,
									   HttpServletResponse response) {
		if (refreshToken != null) {
			authService.logout(refreshToken); // This extracts the email from the token and nullifies it
		}
		else
		{
			throw new InvalidInputException("Refresh Token is null || Already logged out!");
		}

		// Invalidate the cookie
		ResponseCookie cookie = ResponseCookie.from("refreshToken", "")
				.httpOnly(true)
				.secure(true)
				.path("/")
				.maxAge(0)
				.sameSite("Strict")
				.build();

		response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

		return new ResponseEntity<>(new ApiResponse("Logged out Successfully!", null), HttpStatus.OK);
	}

}
