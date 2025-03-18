package com.learning.NrCreation.Response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AddressDTO {
    private Long addressId;

    private String apartNo;
    private String apartName;
    private String streetName;
    private String state;
    private String city;
    private Integer pincode;
}
