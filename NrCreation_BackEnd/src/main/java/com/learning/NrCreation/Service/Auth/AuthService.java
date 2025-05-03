package com.learning.NrCreation.Service.Auth;

import com.learning.NrCreation.Request.LoginRequest;
import com.learning.NrCreation.Request.RegisterRequest;
import com.learning.NrCreation.Response.AuthResponse;

import java.util.Map;

public interface AuthService {
	Map<String,Object> register(RegisterRequest request);
	Map<String,Object> login(LoginRequest request);
	Map<String,Object> refreshAccessToken(String refreshToken);
	void logout(String token);
}
