package com.learning.NrCreation.Response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AddressDTO {
    private Long addressId;
    private String address;
    private String fullName;
    private String phone;
    private String city;
    private String state;
    private String pinCode;
    private String country;
}
