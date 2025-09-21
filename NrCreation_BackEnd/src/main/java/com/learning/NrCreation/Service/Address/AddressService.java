package com.learning.NrCreation.Service.Address;


import com.learning.NrCreation.Entity.Address;
import com.learning.NrCreation.Request.AddressRequest;
import com.learning.NrCreation.Response.AddressDTO;

import java.util.List;

public interface AddressService {
     Address addAddress(String authHeader, AddressRequest address);
     AddressDTO updateAddress(AddressRequest addressRequest, Long addressId, String authHeader);
     void deleteAddress(Long addressId, String authHeader);
     Address getAddressByIdAndAuthHeader(Long addressId, String authHeader);
     List<AddressDTO> getAllAddress();
     List<AddressDTO> getCustomerAllAddress(String authHeader);
     AddressDTO convertToAddressDTO(Address address);
}
