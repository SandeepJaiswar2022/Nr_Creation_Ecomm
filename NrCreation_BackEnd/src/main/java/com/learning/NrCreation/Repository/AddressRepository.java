package com.learning.NrCreation.Repository;

import com.learning.NrCreation.Entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AddressRepository extends JpaRepository<Address, Long> {
}
