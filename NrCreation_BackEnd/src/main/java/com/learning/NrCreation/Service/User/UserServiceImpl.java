package com.learning.NrCreation.Service.User;


import com.learning.NrCreation.Entity.*;
import com.learning.NrCreation.Exception.InvalidInputException;
import com.learning.NrCreation.Exception.ResourceNotFoundException;
import com.learning.NrCreation.Repository.UserRepository;
import com.learning.NrCreation.Request.UpdateUserProfileRequest;
import com.learning.NrCreation.Response.*;
import com.learning.NrCreation.Service.Address.AddressService;
import com.learning.NrCreation.Service.Auth.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

	private final UserRepository userRepo;
	private final JwtService jwtService;
	private final PasswordEncoder passwordEncoder;

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



		//Converting to AddressDto
//		List<AddressDTO> addressDTOs = new ArrayList<>();
//
//
//		if(!user.getAddresses().isEmpty())
//		{
//			for(Address address : user.getAddresses())
//			{
//				AddressDTO addressDto = new AddressDTO(
//						address.getId(),
//						address.getAddress(),
//						address.getFullName(),
//						address.getPhone(),
//						address.getCity(),
//						address.getState(),
//						address.getPinCode(),
//						address.getCountry()
//				);
//				addressDTOs.add(addressDto);
//			}
//		}

//		//Converting to CartDTO
//		CartDTO cartDTO = new CartDTO();

//		Cart cart = user.getCart();
//
//		if(cart != null)
//		{
//			cartDTO.setCartId(cart.getCartId());
//			cartDTO.setTotalAmount(cart.getTotalAmount());
//			Set<CartItemDTO> cartItemDTOs = new HashSet<>();
//
//			for(CartItem cartItem : cart.getItems())
//			{
//				CartItemDTO cartItemDto = new CartItemDTO();
//				cartItemDto.setItemId(cartItem.getId());
//				cartItemDto.setQuantity(cartItem.getQuantity());
//				cartItemDto.setUnitPrice(cartItem.getUnitPrice());
//				cartItemDto.setTotalPrice(cartItem.getTotalPrice());
//				cartItemDto.setProductId(cartItem.getProduct().getId());
//				cartItemDTOs.add(cartItemDto);
//			}
//			cartDTO.setItems(cartItemDTOs);
//		}
//		else
//		{
//			cartDTO=null;
//		}

		//Converting to OrderDto

//		List<OrderDTO> orderDTOs = new ArrayList<>();

//		if(!user.getOrders().isEmpty())
//		{
//			for(Order order : user.getOrders())
//			{
//				OrderDTO dto = new OrderDTO();
//				dto.setOrderDate(order.getOrderDate());
//				dto.setOrderAmount(order.getOrderAmount());
//				dto.setShippingDate(order.getShippingDate());
//				dto.setOrderStatus(order.getOrderStatus().name());
//				dto.setRazorpayOrderId(order.getRazorpayOrderId());
//				dto.setRazorpayPaymentId(order.getRazorpayPaymentId());
//				dto.setShippingMethod(order.getShippingMethod());
//				dto.setOrderId(order.getOrderId());
//				dto.setCustomerId(order.getUser().getId());
//				dto.setCustomerName(order.getUser().getFirstName() + " " + order.getUser().getLastName());
//
//				// Set shipping address
//				AddressDTO addressDTO = addressService.convertToAddressDTO(order.getShippingAddress());
//				dto.setShippingAddress(addressDTO);
//
//				// Set order items
//				Set<OrderItemDTO> itemDTOs = order.getOrderItems().stream()
//						.map(item -> {
//							OrderItemDTO itemDTO = new OrderItemDTO();
//							itemDTO.setId(item.getId());
//							itemDTO.setProductId(item.getProductId());
//							itemDTO.setProductName(item.getProductName());
//							itemDTO.setQuantity(item.getQuantity());
//							itemDTO.setPrice(item.getPrice());
//							itemDTO.setImageUrl(item.getImageUrl());
//							itemDTO.setTotalPrice(item.getTotalPrice());
//							return itemDTO;
//						})
//						.collect(Collectors.toSet());
//				dto.setOrderItems(itemDTOs);
//				orderDTOs.add(dto);
//			}
//		}

		//Converting To ReviewsDTO
//		List<ReviewDTO> reviewDTOs = new ArrayList<>();
//		if(!user.getReviews().isEmpty())
//		{
//			for(Review review : user.getReviews())
//			{
//				ReviewDTO reviewDTO = new ReviewDTO();
//				reviewDTO.setReviewId(review.getReviewId());
//				reviewDTO.setDescription(review.getDescription());
//				reviewDTO.setRating(review.getRating().name());
//				reviewDTO.setCustomerFullName(review.getUser().getFirstName() + " " + review.getUser().getLastName());
//				reviewDTOs.add(reviewDTO);
//			}
//		}

		//Converting To PaymentDTO
//		List<PaymentDTO> paymentDTOs = new ArrayList<>();
//
//		if(!user.getPayments().isEmpty())
//		{
//			for(Payment payment : user.getPayments())
//			{
//				PaymentDTO paymentDTO = new PaymentDTO();
//				paymentDTO.setPaymentId(Long.valueOf(payment.getRazorpayPaymentId()));
//				paymentDTOs.add(paymentDTO);
//			}
//		}

		//Converting from User to UserDTO

		UserDTO userDto = new UserDTO();
		userDto.setUserId(user.getId());
		userDto.setEmail(user.getEmail());
		userDto.setFirstName(user.getFirstName());
		userDto.setLastName(user.getLastName());
		userDto.setRole(user.getRole().name());
		userDto.setPhone(user.getPhone());
		userDto.setDateOfBirth(user.getDateOfBirth());
//		userDto.setAddresses(new ArrayList<>());
//		userDto.setCart(null);
//		userDto.setOrders(new ArrayList<>());
//		userDto.setReviews(new ArrayList<>());
//		userDto.setPaymentHistory(new ArrayList<>());
		return userDto;
	}

	@Override
	public List<UserDTO> convertToDtoList(List<User> users) {
		return users.stream().map(this :: convertToDtoResponse).toList();
	}


	@Override
	public Page<User> getUsersBySearchFilterSort(String search, Integer birthYear, String city, String state, Pageable pageable) {
		Specification<User> spec = UserSpecification.withFilters(search, birthYear, city, state);
		return userRepo.findAll(spec, pageable);
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
	public User getUserById(Long userId) {
        return userRepo.findById(userId)
				.orElseThrow(()-> new ResourceNotFoundException("User not found with id : "+userId));
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
	public User updateUser(UpdateUserProfileRequest request, String email) {
		System.out.println("\n\n User update \n\n");

		return userRepo.findByEmail(email)
		.map(existingUser -> {
			existingUser.setEmail(request.getEmail());
			existingUser.setFirstName(request.getFirstName());
			existingUser.setLastName(request.getLastName());
			existingUser.setPhone(request.getPhone());
			return userRepo.save(existingUser);
		})
		.orElseThrow(()->new ResourceNotFoundException("User not found!"));
	}
}
