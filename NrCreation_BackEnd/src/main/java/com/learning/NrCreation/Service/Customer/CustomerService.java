package com.learning.NrCreation.Service.Customer;

import com.learning.NrCreation.Entity.Customer;

public interface CustomerService {
    public Customer findCustomerByEmail(String email);
}
