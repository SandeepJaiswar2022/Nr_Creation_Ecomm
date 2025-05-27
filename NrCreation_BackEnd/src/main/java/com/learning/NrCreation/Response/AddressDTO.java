package com.learning.NrCreation.Response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AddressDTO {
    private Long addressId;
    private String address1;
    private String address2;
    private String city;
    private String state;
    private String pinCode;
    private String country;
}
