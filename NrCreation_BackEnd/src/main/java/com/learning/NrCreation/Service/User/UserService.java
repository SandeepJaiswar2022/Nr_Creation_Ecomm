package com.learning.NrCreation.Service.User;


import com.learning.NrCreation.Entity.User;
import com.learning.NrCreation.Request.UpdateUserProfileRequest;
import com.learning.NrCreation.Response.UserDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface UserService {
	List<User> getAllUsers();
	
	void changeUserRole(String email, String role);
	
	UserDTO convertToDtoResponse(User user);
	
	List<UserDTO> convertToDtoList(List<User> users);
	
	User getUserByEmail(String email);

	Page<User> getUsersBySearchFilterSort(String search, Integer birthYear, String city, String state, Pageable pageable);

	User findUserByJwtToken(String authHeader);
	User getUserById(Long userId);

	void deleteUserById(Long userId);
	
	User updateUser(UpdateUserProfileRequest request, String email);
}
