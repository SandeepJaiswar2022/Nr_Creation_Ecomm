package com.learning.NrCreation.Service.Product;

import com.learning.NrCreation.Entity.Product;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;


public class ProductSpecification {
    public static Specification<Product> withFilters(String search, String category, Boolean available, BigDecimal low, BigDecimal high) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (search != null && !search.isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("name")), "%" + search.toLowerCase() + "%"));
            }

            if (category != null && !category.isEmpty()) {
                predicates.add(cb.equal(cb.lower(root.get("category").get("name")), category.toLowerCase()));
            }

            if (available != null) {
                if (available) {
                    predicates.add(cb.greaterThan(root.get("inventory"), 0));
                } else {
                    predicates.add(cb.equal(root.get("inventory"), 0));
                }
            }

            // Price range
            if (low != null && high != null) {
                predicates.add(cb.between(root.get("price"), low, high));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

}
