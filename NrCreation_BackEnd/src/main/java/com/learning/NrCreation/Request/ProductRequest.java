package com.learning.NrCreation.Request;

import com.learning.NrCreation.Entity.Category;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductRequest {

    private String name;
	
	private String brand;
	
	private BigDecimal price;
	
	private Integer inventory;

	private Integer size;

	private String category;
	
	private String description;
}
