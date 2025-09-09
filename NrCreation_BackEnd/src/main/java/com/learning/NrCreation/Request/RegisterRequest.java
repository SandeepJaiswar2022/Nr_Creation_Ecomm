package com.learning.NrCreation.Request;

import jakarta.validation.constraints.*;
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
	@Pattern(
			regexp = "^[1-9][0-9]{9}$",
			message = "Phone number must be exactly 10 digits and cannot start with 0"
	)
	private String phone;
}
