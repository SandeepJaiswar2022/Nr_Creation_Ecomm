package com.learning.NrCreation.Repository;

import com.learning.NrCreation.Entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AddressRepository extends JpaRepository<Address, Long> {
    List<Address> findByUserId(Long customerId);
}
