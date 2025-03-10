package com.learning.NrCreation.Request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {
	@NotBlank(message = "First name cannot be blank")
	private String firstName;
	private String lastName;
	@NotBlank(message = "Email cannot be empty")	
    @Email(message = "Invalid email format")
	private String email;
	@NotBlank(message = "Password cannot be empty")
    @Size(min = 8, message = "Password must be greater than 8")
	@Pattern(
			regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).*$",
		    message = "Password must contain at least one digit, one lowercase letter, one uppercase letter, and one special character (@#$%^&+=!)"
	)
	private String password;

}
