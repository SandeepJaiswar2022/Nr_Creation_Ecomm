package com.learning.NrCreation.Service.User;


import com.learning.NrCreation.Entity.*;
import com.learning.NrCreation.Exception.InvalidInputException;
import com.learning.NrCreation.Exception.ResourceNotFoundException;
import com.learning.NrCreation.Repository.CartRepository;
import com.learning.NrCreation.Repository.CustomerRepository;
import com.learning.NrCreation.Repository.UserRepository;
import com.learning.NrCreation.Request.RegisterRequest;
import com.learning.NrCreation.Response.*;
import com.learning.NrCreation.Service.Auth.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

	private final UserRepository userRepo;
	private final JwtService jwtService;
	private final PasswordEncoder passwordEncoder;
	private final CustomerRepository customerRepo;
	private final CartRepository cartRepository;

	@Override
	public List<User> getAllUsers() {
		return userRepo.findAll();
	}

	@Override
	public void changeUserRole(String email, String role) {
		
		if(!role.equals("ADMIN") && !role.equals("USER"))
		{
			throw new InvalidInputException("Role should be from set [ADMIN, USER]");
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
	public UserDTO convertToDtoResponse(User user) {

		//Fetching all details of User from the Customer class

		Optional<Customer> customerOpt = customerRepo.findByEmail(user.getEmail());
		if(customerOpt.isEmpty())
		{
			throw new ResourceNotFoundException("User not found with email : "+user.getEmail());
		}

		Customer customer = customerOpt.get();

		//UserDto has AddressDto, CartDTO, OrderDTO, ReviewDTO, PaymentDTO,
		// Get all these DTOs and then set to the UserDTO,

 //Letter we will shift all these Conversion to respected Services (i.e., convertToCartDto in CartService)

		//Converting to AddressDto
		List<AddressDTO> addressDTOs = new ArrayList<>();


		if(!customer.getAddresses().isEmpty())
		{
			for(Address address : customer.getAddresses())
			{
				AddressDTO addressDto = new AddressDTO();
				addressDto.setAddressId(address.getAddressId());
				addressDto.setApartNo(address.getApartNo());
				addressDto.setApartName(address.getApartName());
				addressDto.setCity(address.getCity());
				addressDto.setState(address.getState());
				addressDto.setStreetName(address.getStreetName());
				addressDto.setPincode(address.getPincode());
				addressDTOs.add(addressDto);
			}
		}

		//Converting to CartDTO
		CartDTO cartDTO = new CartDTO();

		Cart cart = customer.getCart();

		if(cart != null)
		{
			cartDTO.setCartId(cart.getCartId());
			cartDTO.setTotalAmount(cart.getTotalAmount());
			Set<CartItemDTO> cartItemDTOs = new HashSet<>();

			for(CartItem cartItem : cart.getItems())
			{
				CartItemDTO cartItemDto = new CartItemDTO();
				cartItemDto.setItemId(cartItem.getId());
				cartItemDto.setQuantity(cartItem.getQuantity());
				cartItemDto.setUnitPrice(cartItem.getUnitPrice());
				cartItemDto.setTotalPrice(cartItem.getTotalPrice());
				cartItemDto.setProductId(cartItem.getProduct().getId());
				cartItemDTOs.add(cartItemDto);
			}
			cartDTO.setItems(cartItemDTOs);
		}
		else
		{
			cartDTO=null;
		}

		//Converting to OrderDto

		List<OrderDTO> orderDTOs = new ArrayList<>();

		if(!customer.getOrders().isEmpty())
		{
			for(Order order : customer.getOrders())
			{
				OrderDTO orderDto = new OrderDTO();
				orderDto.setOrderId(order.getOrderId());
				orderDto.setUserId(order.getCustomer().getCustomerId());
				orderDto.setOrderDate(order.getOrderDate());
				orderDto.setOrderStatus(order.getOrderStatus().name());
				orderDto.setTotalAmount(order.getOrderAmount());
				List<OrderItemDTO> orderItemDTOs = new ArrayList<>();
				for(OrderItem orderItem : order.getOrderItems())
				{
					OrderItemDTO orderItemDTO = new OrderItemDTO(orderItem.getProduct().getId()
							,orderItem.getProduct().getName(),
							orderItem.getQuantity(),orderItem.getPrice());
					orderItemDTOs.add(orderItemDTO);
				}
				orderDto.setItems(orderItemDTOs);
				orderDTOs.add(orderDto);
			}
		}

		//Converting To ReviewsDTO
		List<ReviewDTO> reviewDTOs = new ArrayList<>();
		if(!customer.getReviews().isEmpty())
		{
			for(Review review : customer.getReviews())
			{
				ReviewDTO reviewDTO = new ReviewDTO();
				reviewDTO.setReviewId(review.getReviewId());
				reviewDTO.setDescription(review.getDescription());
				reviewDTO.setRating(review.getRating().name());
				reviewDTO.setCustomerFullName(review.getCustomer().getFirstName() + " " + review.getCustomer().getLastName());
				reviewDTOs.add(reviewDTO);
			}
		}

		//Converting To PaymentDTO
		List<PaymentDTO> paymentDTOs = new ArrayList<>();

		if(!customer.getPayments().isEmpty())
		{
			for(Payment payment : customer.getPayments())
			{
				PaymentDTO paymentDTO = new PaymentDTO(payment.getPaymentId(),
						payment.getOrder().getOrderId(),
						payment.getCustomer().getEmail(),
						payment.getPaymentMode().name()
						,payment.getDateOfPayment());
				paymentDTOs.add(paymentDTO);
			}
		}

		//Converting from User to UserDTO

		UserDTO userDto = new UserDTO();
		userDto.setUserId(user.getId());
		userDto.setEmail(user.getEmail());
		userDto.setFirstName(user.getFirstName());
		userDto.setLastName(user.getLastName());
		userDto.setRole(user.getRole().name());
		userDto.setPhone(customer.getPhone());
		userDto.setDateOfBirth(customer.getDateOfBirth());
		userDto.setAddresses(addressDTOs);
		userDto.setCart(cartDTO);
		userDto.setOrders(orderDTOs);
		userDto.setReviews(reviewDTOs);
		userDto.setPaymentHistory(paymentDTOs);
		return userDto;
	}

	@Override
	public List<UserDTO> convertToDtoList(List<User> users) {
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
	public Customer getUserById(Long userId) {
		Customer user = customerRepo.findById(userId)
				.orElseThrow(()-> new ResourceNotFoundException("User not found with id : "+userId));
		return user;
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
