package com.learning.NrCreation.Request;

import lombok.Data;

@Data
public class CreateAddressRequest {
    private String address1;
    private String address2;
    private String city;
    private String state;
    private String pinCode;
    private String country;
}
