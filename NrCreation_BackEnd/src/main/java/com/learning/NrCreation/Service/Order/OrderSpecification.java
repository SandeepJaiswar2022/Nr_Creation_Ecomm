package com.learning.NrCreation.Service.Order;

import com.learning.NrCreation.Entity.Customer;
import com.learning.NrCreation.Entity.Order;
import com.learning.NrCreation.Entity.OrderItem;
import com.learning.NrCreation.Enum.OrderStatus;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
public class OrderSpecification {

    public static Specification<Order> withFilters(
            String search,
            OrderStatus status,
            String shippingMethod,
            LocalDate startDate,
            LocalDate endDate,
            BigDecimal priceLow,
            BigDecimal priceHigh,
            Long customerId  // null for admin, not null for user
    ) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            // Filter: Status
            if (status != null) {
                predicates.add(cb.equal(root.get("orderStatus"), status));
            }

            // Filter: Shipping Method
            if (shippingMethod != null && !shippingMethod.isBlank()) {
                predicates.add(cb.equal(root.get("shippingMethod"), shippingMethod));
            }

            // Filter: Date range
            if (startDate != null && endDate != null) {
                predicates.add(cb.between(
                        root.get("orderDate"),
                        startDate.atStartOfDay(),
                        endDate.atTime(23, 59, 59)
                ));
            }

            // Filter: Amount
            if (priceLow != null && priceHigh != null) {
                predicates.add(cb.between(root.get("orderAmount"), priceLow, priceHigh));
            }

            // Filter: Customer ID (user only)
            if (customerId != null) {
                predicates.add(cb.equal(root.get("customer").get("customerId"), customerId));
            }

            // --- SEARCH ---
            if (search != null && !search.isBlank()) {
                List<Predicate> searchPredicates = new ArrayList<>();

                // Join with OrderItem for productName
                Join<Order, OrderItem> orderItemsJoin = root.join("orderItems", JoinType.LEFT);

                // Match productName
                searchPredicates.add(cb.like(cb.lower(orderItemsJoin.get("productName")), "%" + search.toLowerCase() + "%"));

                // If admin, also match Customer email
                if (customerId == null) {
                    Join<Order, Customer> customerJoin = root.join("customer", JoinType.LEFT);
                    searchPredicates.add(cb.like(cb.lower(customerJoin.get("email")), "%" + search.toLowerCase() + "%"));
                }

                // Combine productName OR email (if admin)
                predicates.add(cb.or(searchPredicates.toArray(new Predicate[0])));
            }

            // Prevent duplicates when joining with orderItems
            query.distinct(true);

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}

