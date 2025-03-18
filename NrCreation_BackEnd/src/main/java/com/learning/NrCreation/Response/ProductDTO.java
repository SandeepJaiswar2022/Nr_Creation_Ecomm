package com.learning.NrCreation.Response;

import com.learning.NrCreation.Entity.Category;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductDTO {
    private Long id;
	
	private String name;
	
	private String brand;
	
	private BigDecimal price;
	
	private Integer inventory;

	private Category category;
	
	private String description;
	
	private List<ImageDTO> images;
}
