package com.learning.NrCreation.Response;

import com.learning.NrCreation.Enum.Role;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
public class UserDto {
	
	private Long userId;
	
	private String firstName;
	
    private String lastName;
	
	private String email;
	
	private Role role;
}
