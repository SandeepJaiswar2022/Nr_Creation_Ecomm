package com.learning.NrCreation.Controller;

import com.learning.NrCreation.Entity.Address;
import com.learning.NrCreation.Request.AddressRequest;
import com.learning.NrCreation.Response.AddressDTO;
import com.learning.NrCreation.Response.ApiResponse;
import com.learning.NrCreation.Service.Address.AddressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${api.prefix}/address")
@PreAuthorize("hasRole('USER')")
@RequiredArgsConstructor
public class AddressController {
    private final AddressService addressService;

    @PreAuthorize("hasAnyAuthority('user:read')")
    @PostMapping("/save-address")
    public ResponseEntity<ApiResponse> createNewAddress(@RequestHeader("Authorization") String authHeader, @RequestBody AddressRequest addressRequest) {
        Address address = addressService.addAddress(authHeader, addressRequest);
        AddressDTO addressDTO = addressService.convertToAddressDTO(address);
        return new ResponseEntity<>(new ApiResponse("Address Saved Successfully!",addressDTO), HttpStatus.OK);
    }

    @PreAuthorize("hasAnyAuthority('user:read')")
    @GetMapping("/get-all-my-addresses")
    public ResponseEntity<ApiResponse> getAllAddress(@RequestHeader("Authorization") String authHeader) {
        List<AddressDTO> addressDTOList = addressService.getCustomerAllAddress(authHeader);
        return new ResponseEntity<>(new ApiResponse("All Address List!", addressDTOList), HttpStatus.OK);
    }
}
