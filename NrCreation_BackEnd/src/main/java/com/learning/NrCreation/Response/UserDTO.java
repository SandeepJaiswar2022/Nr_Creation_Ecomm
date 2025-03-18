package com.learning.NrCreation.Response;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;


@Data
@NoArgsConstructor
public class UserDTO {
	
	private Long userId;
	
	private String firstName;
	
    private String lastName;
	
	private String email;

	private String phone;

	private Date dateOfBirth;

	private List<AddressDTO> addresses;

	private CartDTO cart;

	private List<OrderDTO> orders;

	private List<ReviewDTO> reviews;

	private List<PaymentDTO> paymentHistory;
	
	private String role;
}
