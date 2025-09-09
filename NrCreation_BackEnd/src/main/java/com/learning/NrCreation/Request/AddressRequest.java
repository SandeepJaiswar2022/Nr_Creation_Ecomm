package com.learning.NrCreation.Request;

import lombok.Data;

@Data
public class AddressRequest {
    private String fullName;
    private String phone;
    private String address;
    private String city;
    private String state;
    private String pinCode;
    private String country;
}
