package com.learning.NrCreation.Entity;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemId implements Serializable {

    private Integer order;
    private Integer product;
}
