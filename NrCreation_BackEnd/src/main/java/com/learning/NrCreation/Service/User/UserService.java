package com.learning.NrCreation.Service.User;


import com.learning.NrCreation.Entity.User;
import com.learning.NrCreation.Request.RegisterRequest;
import com.learning.NrCreation.Response.UserDTO;

import java.util.List;

public interface UserService {
	List<User> getAllUsers();
	
	void changeUserRole(String email, String role);
	
	UserDTO convertToDtoResponse(User user);
	
	List<UserDTO> convertToDtoList(List<User> users);
	
	User getUserByEmail(String email);

	User findUserByJwtToken(String authHeader);
	
	void deleteUserById(Long userId);
	
	User updateUser(RegisterRequest request, Long userId);
}
