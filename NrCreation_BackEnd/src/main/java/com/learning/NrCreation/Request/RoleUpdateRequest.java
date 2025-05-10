package com.learning.NrCreation.Request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RoleUpdateRequest {
    @NotBlank(message = "Email must not be blank")
    @Email(message = "Invalid email format")
    private String userEmail;

    @NotBlank(message = "Role must not be blank")
    private String role;
}
