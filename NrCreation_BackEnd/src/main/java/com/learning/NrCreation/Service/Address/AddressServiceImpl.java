package com.learning.NrCreation.Service.Address;

import com.learning.NrCreation.Entity.Address;
import com.learning.NrCreation.Entity.User;
import com.learning.NrCreation.Exception.ResourceNotFoundException;
import com.learning.NrCreation.Exception.UnauthorizedAccessException;
import com.learning.NrCreation.Repository.AddressRepository;
import com.learning.NrCreation.Request.AddressRequest;
import com.learning.NrCreation.Response.AddressDTO;
import com.learning.NrCreation.Service.User.UserService;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AddressServiceImpl implements AddressService{
    private final UserService userService;
    private final AddressRepository addressRepository;

    @Override
    public Address addAddress(String authHeader, AddressRequest addressRequest) {
        User user = userService.findUserByJwtToken(authHeader);
        Address addressToSave = getAddress(addressRequest, user);
       return addressRepository.save(addressToSave);
    }

    private static @NotNull Address getAddress(AddressRequest addressRequest, User user) {
        Address addressToSave = new Address();
        addressToSave.setCity(addressRequest.getCity());
        addressToSave.setCountry(addressRequest.getCountry());
        addressToSave.setState(addressRequest.getState());
        addressToSave.setFullName(addressRequest.getFullName());
        addressToSave.setAddress(addressRequest.getAddress());
        addressToSave.setPinCode(addressRequest.getPinCode());
        addressToSave.setPhone(addressRequest.getPhone()); // Include phone from request
        addressToSave.setUser(user);
        return addressToSave;
    }

    @Override
    public AddressDTO updateAddress(AddressRequest addressRequest, Long addressId, String authHeader) {

        Address existingAddress = getAddressByIdAndAuthHeader(addressId, authHeader);

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
        Address address = getAddressByIdAndAuthHeader(addressId, authHeader);
        addressRepository.delete(address);
    }

    @Override
    public Address getAddressByIdAndAuthHeader(Long addressId, String authHeader) {
        User user = userService.findUserByJwtToken(authHeader);

        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found"));

        if(address.getUser()==null)
        {
            throw new UnauthorizedAccessException("Unauthorized to view this address.");
        }
        if (!address.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedAccessException("Unauthorized to view this address.");
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
        List<Address> addresses = addressRepository.findByUserId(user.getId());
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
