package com.learning.NrCreation.Service.User;


import com.learning.NrCreation.Entity.User;
import com.learning.NrCreation.Exception.InvalidInputException;
import com.learning.NrCreation.Exception.ResourceNotFoundException;
import com.learning.NrCreation.Repository.UserRepository;
import com.learning.NrCreation.Request.RegisterRequest;
import com.learning.NrCreation.Response.UserDto;
import com.learning.NrCreation.Service.Auth.IJwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService implements IUserService {

	private final UserRepository userRepo;
	private final IJwtService jwtService;
	private final PasswordEncoder passwordEncoder;
	
	
	@Override
	public List<User> getAllUsers() {
		return userRepo.findAll();
	}

	@Override
	public void changeUserRole(String email, String role) {
		
		if(!role.equals("ADMIN") && !role.equals("USER") && !role.equals("MANAGER"))
		{
			throw new InvalidInputException("Role should be from set [ADMIN, USER, MANAGER]");
		}
		
		Optional<User> user = userRepo.findByEmail(email);
		
		if(user.isPresent())
		{
			userRepo.updateUserRole(email, role);
		}
		else {
			throw new ResourceNotFoundException("User not found with email : "+email);
		}
		
	}

	@Override
	public UserDto convertToDtoResponse(User user) {
		UserDto userDto = new UserDto();
		userDto.setUserId(user.getId());
		userDto.setEmail(user.getEmail());
		userDto.setFirstName(user.getFirstName());
		userDto.setLastName(user.getLastName());
		userDto.setRole(user.getRole());
		return userDto;
	}

	@Override
	public List<UserDto> convertToDtoList(List<User> users) {
		return users.stream().map(this :: convertToDtoResponse).toList();
	}

	
	@Override
	public User getUserByEmail(String email)
	{
	   return userRepo.findByEmail(email).orElseThrow(()-> new ResourceNotFoundException("User not Found with Email : "+email));
	}
	
	@Override
	public User findUserByJwtToken(String authHeader) {
        String jwtToken = authHeader.substring(7);
        String email = jwtService.extractUsername(jwtToken);
        Optional<User> user = userRepo.findByEmail(email);
        if (user.isEmpty()) {
            throw new ResourceNotFoundException("User not found with email"+email);
        }
        return user.get();
    }

	@Override
	public void deleteUserById(Long userId) {
		userRepo.findById(userId).ifPresentOrElse(userRepo::delete,
				()->{
					throw new ResourceNotFoundException("User not found with id : "+userId);
					}
				);
		
	}

	@Override
	public User updateUser(RegisterRequest request, Long userId) {
		return userRepo.findById(userId)
		.map(existingUser -> {
			existingUser.setEmail(request.getEmail());
			existingUser.setFirstName(request.getFirstName());
			existingUser.setLastName(request.getLastName());
			existingUser.setPassword(passwordEncoder.encode(request.getPassword()));
			return userRepo.save(existingUser);
		})
		.orElseThrow(()->new ResourceNotFoundException("User not found with id : "+userId));
	}
}
