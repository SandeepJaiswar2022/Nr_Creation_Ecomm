package com.learning.NrCreation.Service.Address;


import com.learning.NrCreation.Entity.Address;
import com.learning.NrCreation.Request.AddressRequest;
import com.learning.NrCreation.Response.AddressDTO;

import java.util.List;

public interface AddressService {
    public Address addAddress(String authHeader, AddressRequest address);
    public AddressDTO updateAddress(AddressRequest addressRequest, Long addressId, String authHeader);
    public void deleteAddress(Long addressId, String authHeader);
    public Address getAddressByIdAndAuthHeader(Long addressId, String authHeader);
    public List<AddressDTO> getAllAddress();
    public AddressDTO convertToAddressDTO(Address address);
}
