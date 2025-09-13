package com.learning.NrCreation.Service.Auth;


import com.learning.NrCreation.Entity.User;
import com.learning.NrCreation.Enum.Role;
import com.learning.NrCreation.Exception.AlreadyExistException;
import com.learning.NrCreation.Exception.InvalidInputException;
import com.learning.NrCreation.Exception.ResourceNotFoundException;
import com.learning.NrCreation.Repository.UserRepository;
import com.learning.NrCreation.Request.LoginRequest;
import com.learning.NrCreation.Request.RegisterRequest;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
	private final UserRepository userRepo;
	private final JwtService jwtService;
	private final PasswordEncoder passwordEncoder;
	private final AuthenticationManager authManager;

	@Override
	public Map<String,Object> register(RegisterRequest request) {
		String normalizedEmail = request.getEmail().toLowerCase();

		if(userRepo.findByEmail(normalizedEmail).isPresent()) {
			throw new AlreadyExistException("User already exists with Email: " + normalizedEmail);
		}

		User user = new User();
		user.setEmail(normalizedEmail);
		user.setFirstName(request.getFirstName());
		user.setLastName(request.getLastName());
		user.setPhone(request.getPhone());
		user.setPassword(passwordEncoder.encode(request.getPassword()));
		user.setRole(Role.USER);
		userRepo.save(user);


		String accessToken = jwtService.generateAccessToken(user);
		String refreshToken = jwtService.generateRefreshToken(user);

		user.setRefreshToken(refreshToken);
		userRepo.save(user);

		return getStringAuthResponse(user, accessToken, refreshToken);
	}

	@Override
	public Map<String,Object> login(LoginRequest request) {
		String normalizedEmail = request.getEmail().toLowerCase();

		User user = userRepo.findByEmail(normalizedEmail)
				.orElseThrow(()-> new ResourceNotFoundException("Email does not exist!"));


		if(!passwordEncoder.matches(request.getPassword(), user.getPassword()))
		{
			throw new InvalidInputException("Invalid password! Try again!");
		}
		authManager.authenticate(
				new UsernamePasswordAuthenticationToken(normalizedEmail, request.getPassword())
				);

		String accessToken = jwtService.generateAccessToken(user);
		String refreshToken = jwtService.generateRefreshToken(user);

		user.setRefreshToken(refreshToken);
		userRepo.save(user);

		return getStringAuthResponse(user, accessToken, refreshToken);
	}

	@NotNull
	private Map<String, Object> getStringAuthResponse(User user, String accessToken, String refreshToken) {
		Map<String, Object> authResponse = new HashMap<>();
		authResponse.put("accessToken", accessToken);
		authResponse.put("refreshToken", refreshToken);

		Map<String, Object> userMap = new HashMap<>();
		userMap.put("email", user.getEmail());
		userMap.put("role", user.getRole());
		userMap.put("firstName", user.getFirstName());
		userMap.put("lastName", user.getLastName());

		authResponse.put("user", userMap);

		return authResponse;
	}

	@Override
	public void logout(String token) {
		String email = jwtService.extractUsername(token);
		User user = userRepo.findByEmail(email)
				.orElseThrow(() -> new ResourceNotFoundException("User not found"));
		user.setRefreshToken(null);
		userRepo.save(user);
	}

	@Override
	public Map<String, Object> refreshAccessToken(String refreshToken) {
		String username = jwtService.extractUsername(refreshToken);
		User user = userRepo.findByEmail(username)
				.orElseThrow(() -> new ResourceNotFoundException("User not found"));

//		System.out.println("did I found the user "+ refreshToken + " username : "+ user.getEmail());
		if (!refreshToken.equals(user.getRefreshToken()) || jwtService.isTokenExpired(refreshToken)) {
			throw new InvalidInputException("Invalid or expired refresh token!");
		}
		String newAccessToken = jwtService.generateAccessToken(user);

		return getStringAuthResponse(user, newAccessToken, null);
	}
	
}
