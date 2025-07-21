package com.learning.NrCreation.Service.Address;

import com.learning.NrCreation.Entity.Address;
import com.learning.NrCreation.Entity.Customer;
import com.learning.NrCreation.Entity.User;
import com.learning.NrCreation.Exception.ResourceNotFoundException;
import com.learning.NrCreation.Exception.UnauthorizedAccessException;
import com.learning.NrCreation.Repository.AddressRepository;
import com.learning.NrCreation.Request.AddressRequest;
import com.learning.NrCreation.Response.AddressDTO;
import com.learning.NrCreation.Service.Customer.CustomerService;
import com.learning.NrCreation.Service.User.UserService;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AddressServiceImpl implements AddressService{
    private final UserService userService;
    private final CustomerService customerService;
    private final AddressRepository addressRepository;

    @Override
    public Address addAddress(String authHeader, AddressRequest addressRequest) {
        User user = userService.findUserByJwtToken(authHeader);
        Customer customer = customerService.findCustomerByEmail(user.getEmail());
        Address addressToSave = getAddress(addressRequest, customer);

       return addressRepository.save(addressToSave);
    }

    private static @NotNull Address getAddress(AddressRequest addressRequest, Customer customer) {
        Address addressToSave = new Address();
        addressToSave.setCity(addressRequest.getCity());
        addressToSave.setCountry(addressRequest.getCountry());
        addressToSave.setState(addressRequest.getState());
        addressToSave.setFullName(addressRequest.getFullName());
        addressToSave.setAddress(addressRequest.getAddress());
        addressToSave.setPinCode(addressRequest.getPinCode());
        addressToSave.setPhone(addressRequest.getPhone()); // Include phone from request
        addressToSave.setCustomer(customer);
        return addressToSave;
    }

    @Override
    public AddressDTO updateAddress(AddressRequest addressRequest, Long addressId, String authHeader) {
        User user = userService.findUserByJwtToken(authHeader);
        Customer customer = customerService.findCustomerByEmail(user.getEmail());

        Address existingAddress = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found"));

        // Optional: Check if the address belongs to the same customer
        if (!existingAddress.getCustomer().getCustomerId().equals(customer.getCustomerId())) {
            throw new UnauthorizedAccessException("You are not authorized to update this address.");
        }

        // Update fields
        existingAddress.setFullName(addressRequest.getFullName());
        existingAddress.setAddress(addressRequest.getAddress());
        existingAddress.setPhone(addressRequest.getPhone());
        existingAddress.setCity(addressRequest.getCity());
        existingAddress.setState(addressRequest.getState());
        existingAddress.setPinCode(addressRequest.getPinCode());
        existingAddress.setCountry(addressRequest.getCountry());

        Address updatedAddress = addressRepository.save(existingAddress);
        return convertToAddressDTO(updatedAddress);
    }

    @Override
    public void deleteAddress(Long addressId, String authHeader) {
        User user = userService.findUserByJwtToken(authHeader);
        Customer customer = customerService.findCustomerByEmail(user.getEmail());

        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found"));

        if (!address.getCustomer().getCustomerId().equals(customer.getCustomerId())) {
            throw new UnauthorizedAccessException("You are not authorized to delete this address.");
        }

        addressRepository.delete(address);
    }

    @Override
    public Address getAddressByIdAndAuthHeader(Long addressId, String authHeader) {
        User user = userService.findUserByJwtToken(authHeader);
        Customer customer = customerService.findCustomerByEmail(user.getEmail());

        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found"));
        if(address.getCustomer()==null)
        {
            throw new UnauthorizedAccessException("You are not authorized to view this address.");
        }
        if (!address.getCustomer().getCustomerId().equals(customer.getCustomerId())) {
            throw new UnauthorizedAccessException("You are not authorized to view this address.");
        }

        return address;
    }


    @Override
    public List<AddressDTO> getAllAddress() {
        List<Address> addresses = addressRepository.findAll();
        return addresses.stream()
                .map(this::convertToAddressDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<AddressDTO> getCustomerAllAddress(String authHeader) {
        User user = userService.findUserByJwtToken(authHeader);
        Customer customer = customerService.findCustomerByEmail(user.getEmail());
        List<Address> addresses = addressRepository.findByCustomerCustomerId(customer.getCustomerId());
        return addresses.stream()
                .map(this::convertToAddressDTO)
                .collect(Collectors.toList());
    }


    @Override
    public AddressDTO convertToAddressDTO(Address address) {
        return new AddressDTO(
                address.getId(),
                address.getAddress(),
                address.getFullName(),
                address.getPhone(),
                address.getCity(),
                address.getState(),
                address.getPinCode(),
                address.getCountry()
        );
    }
}
