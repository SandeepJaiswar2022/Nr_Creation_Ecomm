package com.learning.NrCreation.Service.Customer;

import com.learning.NrCreation.Entity.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CustomerService {
    public Customer findCustomerByEmail(String email);

    public Page<Customer> getCustomersBySearchFilterSort(String search, Integer birthYear, String city, String state, Pageable pageable);
}
