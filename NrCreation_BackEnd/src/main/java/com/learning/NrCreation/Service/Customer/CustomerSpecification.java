package com.learning.NrCreation.Service.Customer;

import com.learning.NrCreation.Entity.Customer;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

public class CustomerSpecification {

    public static Specification<Customer> withFilters(String search, Integer birthYear, String city, String state) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Search by email or phone
            if (search != null && !search.isEmpty()) {
                String pattern = "%" + search.toLowerCase() + "%";
                predicates.add(
                        cb.or(
                                cb.like(cb.lower(root.get("email")), pattern),
                                cb.like(cb.lower(root.get("phone")), pattern)
                        )
                );
            }

            // Filter by year of birth
            if (birthYear != null) {
                Calendar start = Calendar.getInstance();
                start.set(birthYear, Calendar.JANUARY, 1, 0, 0, 0);
                start.set(Calendar.MILLISECOND, 0);

                Calendar end = Calendar.getInstance();
                end.set(birthYear, Calendar.DECEMBER, 31, 23, 59, 59);
                end.set(Calendar.MILLISECOND, 999);

                predicates.add(cb.between(root.get("dateOfBirth"), start.getTime(), end.getTime()));
            }

            // Join with Address if filtering by city/state
            if ((city != null && !city.isEmpty()) || (state != null && !state.isEmpty())) {
                root.join("addresses", jakarta.persistence.criteria.JoinType.LEFT);

                if (city != null && !city.isEmpty()) {
                    predicates.add(cb.equal(cb.lower(root.join("addresses").get("city")), city.toLowerCase()));
                }

                if (state != null && !state.isEmpty()) {
                    predicates.add(cb.equal(cb.lower(root.join("addresses").get("state")), state.toLowerCase()));
                }

                query.distinct(true); // Important when joining
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
