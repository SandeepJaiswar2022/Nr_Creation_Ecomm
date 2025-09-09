package com.learning.NrCreation.Service.Customer;

import com.learning.NrCreation.Entity.Customer;
import com.learning.NrCreation.Exception.ResourceNotFoundException;
import com.learning.NrCreation.Repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService{
    private final CustomerRepository customerRepo;

    @Override
    public Customer findCustomerByEmail(String email) {
        return customerRepo.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Customer with email " + email + " not found"));
    }

}
