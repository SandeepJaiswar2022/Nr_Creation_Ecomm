package com.learning.NrCreation.Service.Auth;


import com.learning.NrCreation.Entity.Customer;
import com.learning.NrCreation.Entity.User;
import com.learning.NrCreation.Enum.Role;
import com.learning.NrCreation.Exception.AlreadyExistException;
import com.learning.NrCreation.Exception.ResourceNotFoundException;
import com.learning.NrCreation.Repository.CustomerRepository;
import com.learning.NrCreation.Repository.UserRepository;
import com.learning.NrCreation.Request.LoginRequest;
import com.learning.NrCreation.Request.RegisterRequest;
import com.learning.NrCreation.Response.AuthResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
	private final UserRepository userRepo;
	private final JwtService jwtService;
	private final PasswordEncoder passwordEncoder;
	private final AuthenticationManager authManager;
	private final CustomerRepository customerRepo;
	
	@Override
	public AuthResponse register(RegisterRequest request) {
		if(userRepo.findByEmail(request.getEmail()).isPresent())
		{
			throw new AlreadyExistException("User already Exists with Email : "+request.getEmail());
		}
		
		User user = new User();
		user.setEmail(request.getEmail());
		user.setFirstName(request.getFirstName());
		user.setLastName(request.getLastName());
		user.setPhone(request.getPhone());
		user.setPassword(passwordEncoder.encode(request.getPassword()));
		user.setRole(Role.USER);
		userRepo.save(user);

		Customer newCustomer = new Customer();
		newCustomer.setFirstName(request.getFirstName());
		newCustomer.setLastName(request.getLastName());
		newCustomer.setPhone(request.getPhone());
		newCustomer.setEmail(request.getEmail());
		customerRepo.save(newCustomer);

		
		String token = jwtService.generateToken(user);
		
		
		return new AuthResponse(token);
	}

	@Override
	public AuthResponse login(LoginRequest request) {
		authManager.authenticate(
				new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
				);
		User user = userRepo.findByEmail(request.getEmail())
				.orElseThrow(()-> new ResourceNotFoundException("User not Found"));
		String token = jwtService.generateToken(user);
		
		return new AuthResponse(token);
	}
	
}
